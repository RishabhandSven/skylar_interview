package com.bi.controller;

import com.bi.analytics.AnalyticsResult;
import com.bi.analytics.AnalyticsService;
import com.bi.dto.Deal;
import com.bi.dto.InsightRequest;
import com.bi.dto.InsightResponse;
import com.bi.dto.RawBoardItem;
import com.bi.dto.WorkOrder;
import com.bi.monday.MondayApiClient;
import com.bi.monday.MondayItemMapper;
import com.bi.service.LlmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/insights")
public class BusinessInsightController {

    private final MondayApiClient mondayApiClient;
    private final MondayItemMapper mondayItemMapper;
    private final AnalyticsService analyticsService;
    private final LlmService llmService;

    private final String dealsBoardId;
    private final String workOrdersBoardId;

    @Autowired
    public BusinessInsightController(
            MondayApiClient mondayApiClient,
            MondayItemMapper mondayItemMapper,
            AnalyticsService analyticsService,
            LlmService llmService,
            @Value("${monday.api.deals-board-id}") String dealsBoardId,
            @Value("${monday.api.work-orders-board-id}") String workOrdersBoardId) {
        this.mondayApiClient = mondayApiClient;
        this.mondayItemMapper = mondayItemMapper;
        this.analyticsService = analyticsService;
        this.llmService = llmService;
        this.dealsBoardId = dealsBoardId;
        this.workOrdersBoardId = workOrdersBoardId;
    }

    @GetMapping
    public ResponseEntity<?> getInsights() {
        try {
            // Fetch deals
            List<RawBoardItem> rawDeals = mondayApiClient.fetchAllItems(dealsBoardId);
            List<Deal> deals = rawDeals.stream()
                    .map(mondayItemMapper::mapToDeal)
                    .collect(Collectors.toList());

            // Fetch work orders
            List<RawBoardItem> rawWorkOrders = mondayApiClient.fetchAllItems(workOrdersBoardId);
            List<WorkOrder> workOrders = rawWorkOrders.stream()
                    .map(mondayItemMapper::mapToWorkOrder)
                    .collect(Collectors.toList());

            // Run analytics
            AnalyticsResult analyticsResult = analyticsService.analyze(deals, workOrders);

            // Create InsightRequest
            InsightRequest request = new InsightRequest(analyticsResult, LocalDate.now());

            // Call LLM Service
            InsightResponse insights = llmService.generateInsights(request);

            return ResponseEntity.ok(insights);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Failed to generate business insights",
                            "message", e.getMessage() != null ? e.getMessage() : "An unexpected error occurred"
                    ));
        }
    }
}
