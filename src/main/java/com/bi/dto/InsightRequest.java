package com.bi.dto;

import com.bi.analytics.AnalyticsResult;

import java.time.LocalDate;

public class InsightRequest {
    private AnalyticsResult analytics;
    private LocalDate generatedDate;

    public InsightRequest() {
    }

    public InsightRequest(AnalyticsResult analytics, LocalDate generatedDate) {
        this.analytics = analytics;
        this.generatedDate = generatedDate;
    }

    public AnalyticsResult getAnalytics() {
        return analytics;
    }

    public void setAnalytics(AnalyticsResult analytics) {
        this.analytics = analytics;
    }

    public LocalDate getGeneratedDate() {
        return generatedDate;
    }

    public void setGeneratedDate(LocalDate generatedDate) {
        this.generatedDate = generatedDate;
    }
}
