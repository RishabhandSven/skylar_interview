package com.bi.monday;

import com.bi.dto.RawBoardItem;
import com.bi.exception.MondayApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class MondayApiClient {

    private final WebClient mondayWebClient;

    private static final String ITEM_FIELDS = """
              items {
                id
                name
                column_values {
                  id
                  text
                  value
                }
              }
        """;

    @Autowired
    public MondayApiClient(WebClient mondayWebClient) {
        this.mondayWebClient = mondayWebClient;
    }

    /**
     * Executes a raw GraphQL request to monday.com with retry and error checking.
     */
    public MondayGraphQlResponse executeQuery(MondayGraphQlRequest request) {
        try {
            return mondayWebClient.post()
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(MondayGraphQlResponse.class)
                    .retryWhen(Retry.fixedDelay(1, Duration.ofSeconds(2))
                            .filter(throwable -> {
                                    if (throwable instanceof WebClientResponseException wcre) {
                                        return wcre.getStatusCode().value() == 429;
                                    }
                                    return false;
                            }))
                    .block();
        } catch (Exception e) {
            throw new MondayApiException("Failed to execute GraphQL query on monday.com: " + e.getMessage(), e);
        }
    }

    /**
     * Recursively pages through items on the specified board using cursors.
     */
    public List<RawBoardItem> fetchAllItems(String boardId) {
        List<RawBoardItem> accumulatedItems = new ArrayList<>();

        // First Page Query
        String initialQuery = """
            query ($boardId: [ID!], $limit: Int) {
              boards (ids: $boardId) {
                items_page (limit: $limit) {
                  cursor
            """
            + ITEM_FIELDS +
            """
                }
              }
            }
            """;

        Map<String, Object> variables = Map.of(
                "boardId", List.of(boardId),
                "limit", 100
        );

        MondayGraphQlRequest request = new MondayGraphQlRequest(initialQuery, variables);
        MondayGraphQlResponse response = executeQuery(request);
        validateResponse(response);

        if (response.getData() == null || response.getData().getBoards() == null || response.getData().getBoards().isEmpty()) {
            return List.of();
        }

        MondayGraphQlResponse.BoardEnvelope board = response.getData().getBoards().get(0);
        if (board.getItemsPage() == null) {
            return List.of();
        }

        if (board.getItemsPage().getItems() != null) {
            accumulatedItems.addAll(board.getItemsPage().getItems());
        }

        String cursor = board.getItemsPage().getCursor();

        // Pagination Query
        String paginationQuery = """
            query ($cursor: String!) {
              next_items_page (cursor: $cursor) {
                cursor
            """
            + ITEM_FIELDS +
            """
              }
            }
            """;

        while (cursor != null && !cursor.isBlank()) {
            Map<String, Object> pageVariables = Map.of("cursor", cursor);
            MondayGraphQlRequest pageRequest = new MondayGraphQlRequest(paginationQuery, pageVariables);
            MondayGraphQlResponse pageResponse = executeQuery(pageRequest);
            validateResponse(pageResponse);

            if (pageResponse.getData() == null || pageResponse.getData().getNextItemsPage() == null) {
                break;
            }

            MondayGraphQlResponse.ItemsPageEnvelope nextPage = pageResponse.getData().getNextItemsPage();
            if (nextPage.getItems() != null) {
                accumulatedItems.addAll(nextPage.getItems());
            }

            cursor = nextPage.getCursor();
        }

        return accumulatedItems;
    }

    private void validateResponse(MondayGraphQlResponse response) {
        if (response == null) {
            throw new MondayApiException("Received null response from monday.com API");
        }
        if (response.getErrors() != null && !response.getErrors().isEmpty()) {
            String errorMsg = response.getErrors().stream()
                    .map(MondayGraphQlResponse.GraphQlError::getMessage)
                    .collect(Collectors.joining("; "));
            throw new MondayApiException("monday.com GraphQL API error(s): " + errorMsg);
        }
    }
}
