package com.bi.dto;

public class InsightResponse {
    private String executiveSummary;
    private String risks;
    private String opportunities;
    private String recommendations;

    public InsightResponse() {
    }

    public InsightResponse(String executiveSummary, String risks, String opportunities, String recommendations) {
        this.executiveSummary = executiveSummary;
        this.risks = risks;
        this.opportunities = opportunities;
        this.recommendations = recommendations;
    }

    public String getExecutiveSummary() {
        return executiveSummary;
    }

    public void setExecutiveSummary(String executiveSummary) {
        this.executiveSummary = executiveSummary;
    }

    public String getRisks() {
        return risks;
    }

    public void setRisks(String risks) {
        this.risks = risks;
    }

    public String getOpportunities() {
        return opportunities;
    }

    public void setOpportunities(String opportunities) {
        this.opportunities = opportunities;
    }

    public String getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }
}
