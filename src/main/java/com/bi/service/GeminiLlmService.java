package com.bi.service;

import com.bi.analytics.AnalyticsResult;
import com.bi.dto.InsightRequest;
import com.bi.dto.InsightResponse;
import com.bi.util.PromptBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class GeminiLlmService implements LlmService {

    private final WebClient webClient;
    private final String apiKey;

    @Autowired
    public GeminiLlmService(WebClient.Builder webClientBuilder) {
        String key = System.getenv("GEMINI_API_KEY");
        if (key == null || key.isBlank()) {
            throw new IllegalStateException("GEMINI_API_KEY environment variable is missing");
        }
        this.apiKey = key;
        this.webClient = webClientBuilder
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    @Override
    public InsightResponse generateInsights(InsightRequest request) {
        String prompt = PromptBuilder.buildPrompt(request);
        GeminiRequest payload = new GeminiRequest(prompt);


        try {
            GeminiResponse response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1beta/models/gemini-3.5-flash:generateContent")
                            .queryParam("key", apiKey)
                            .build())
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(GeminiResponse.class)
                    .block();

            if (response == null || response.getCandidates() == null || response.getCandidates().isEmpty()) {
                return new InsightResponse("Received empty response from Gemini API.", "", "", "");
            }

            GeminiResponse.Candidate candidate = response.getCandidates().get(0);
            if (candidate.getContent() == null || candidate.getContent().getParts() == null || candidate.getContent().getParts().isEmpty()) {
                return new InsightResponse("Gemini response candidate does not contain parts content.", "", "", "");
            }

            String text = candidate.getContent().getParts().get(0).getText();
            return parseGeminiText(text);

        } catch (Exception e) {
            return new InsightResponse(
                    "Failed to generate insights due to Gemini API communication error: " + e.getMessage(),
                    "", "", ""
            );
        }
    }

    private InsightResponse parseGeminiText(String text) {
        if (text == null || text.isBlank()) {
            return new InsightResponse("", "", "", "");
        }

        String lowerText = text.toLowerCase();

        int idxExec = findSectionIndex(lowerText, "executive summary");
        int idxRisks = findSectionIndex(lowerText, "risks");
        int idxOpp = findSectionIndex(lowerText, "opportunities");
        int idxRec = findSectionIndex(lowerText, "recommendations");

        if (idxExec == -1 && idxRisks == -1 && idxOpp == -1 && idxRec == -1) {
            return new InsightResponse(text, "", "", "");
        }

        String execContent = "";
        String risksContent = "";
        String oppContent = "";
        String recContent = "";

        int len = text.length();

        List<SectionBoundary> boundaries = new ArrayList<>();
        if (idxExec != -1) boundaries.add(new SectionBoundary("EXEC", idxExec));
        if (idxRisks != -1) boundaries.add(new SectionBoundary("RISKS", idxRisks));
        if (idxOpp != -1) boundaries.add(new SectionBoundary("OPP", idxOpp));
        if (idxRec != -1) boundaries.add(new SectionBoundary("REC", idxRec));

        boundaries.sort((a, b) -> Integer.compare(a.index, b.index));

        for (int i = 0; i < boundaries.size(); i++) {
            SectionBoundary current = boundaries.get(i);
            int start = current.index;
            int end = (i + 1 < boundaries.size()) ? boundaries.get(i + 1).index : len;

            String content = text.substring(start, end);
            content = stripHeader(content, current.type);

            switch (current.type) {
                case "EXEC":
                    execContent = content.trim();
                    break;
                case "RISKS":
                    risksContent = content.trim();
                    break;
                case "OPP":
                    oppContent = content.trim();
                    break;
                case "REC":
                    recContent = content.trim();
                    break;
            }
        }

        if (execContent.isEmpty() && risksContent.isEmpty() && oppContent.isEmpty() && recContent.isEmpty()) {
            return new InsightResponse(text, "", "", "");
        }

        return new InsightResponse(execContent, risksContent, oppContent, recContent);
    }

    private int findSectionIndex(String text, String term) {
        return text.indexOf(term);
    }

    private String stripHeader(String sectionContent, String type) {
        String[] lines = sectionContent.split("\\r?\\n");
        if (lines.length == 0) {
            return sectionContent;
        }

        StringBuilder sb = new StringBuilder();
        boolean skippedHeader = false;
        for (String line : lines) {
            if (!skippedHeader) {
                String lower = line.toLowerCase();
                boolean matches = false;
                switch (type) {
                    case "EXEC":
                        matches = lower.contains("executive") && lower.contains("summary");
                        break;
                    case "RISKS":
                        matches = lower.contains("risk");
                        break;
                    case "OPP":
                        matches = lower.contains("opportunit");
                        break;
                    case "REC":
                        matches = lower.contains("recommendation");
                        break;
                }
                if (matches) {
                    skippedHeader = true;
                    continue;
                }
            }
            sb.append(line).append("\n");
        }
        return sb.toString();
    }

    private static class SectionBoundary {
        String type;
        int index;

        SectionBoundary(String type, int index) {
            this.type = type;
            this.index = index;
        }
    }

    // Gemini API DTO Models (Request)
    private static class GeminiRequest {
        private final List<Content> contents;

        public GeminiRequest(String promptText) {
            this.contents = List.of(new Content(List.of(new Part(promptText))));
        }

        public List<Content> getContents() {
            return contents;
        }

        public static class Content {
            private final List<Part> parts;

            public Content(List<Part> parts) {
                this.parts = parts;
            }

            public List<Part> getParts() {
                return parts;
            }
        }

        public static class Part {
            private final String text;

            public Part(String text) {
                this.text = text;
            }

            public String getText() {
                return text;
            }
        }
    }

    // Gemini API DTO Models (Response)
    private static class GeminiResponse {
        private List<Candidate> candidates;

        public List<Candidate> getCandidates() {
            return candidates;
        }

        public void setCandidates(List<Candidate> candidates) {
            this.candidates = candidates;
        }

        public static class Candidate {
            private Content content;

            public Content getContent() {
                return content;
            }

            public void setContent(Content content) {
                this.content = content;
            }
        }

        public static class Content {
            private List<Part> parts;

            public List<Part> getParts() {
                return parts;
            }

            public void setParts(List<Part> parts) {
                this.parts = parts;
            }
        }

        public static class Part {
            private String text;

            public String getText() {
                return text;
            }

            public void setText(String text) {
                this.text = text;
            }
        }
    }
}
