package com.bi.util;

import com.bi.analytics.AnalyticsResult;
import com.bi.dto.InsightRequest;

public class PromptBuilder {

    public static String buildPrompt(InsightRequest request) {
        if (request == null || request.getAnalytics() == null) {
            return "No analytics data available.";
        }
        AnalyticsResult ar = request.getAnalytics();
        return String.format(
                "You are a Business Intelligence consultant.\n\n" +
                "Today's date: %s\n\n" +
                "Today's analytics:\n" +
                "- Total Deals: %d\n" +
                "- Won Deals: %d\n" +
                "- Lost Deals: %d\n" +
                "- Open Deals: %d\n" +
                "- Total Pipeline Value: %s\n" +
                "- Average Deal Value: %s\n" +
                "- Total Work Orders: %d\n" +
                "- Completed Work Orders: %d\n" +
                "- Pending Work Orders: %d\n" +
                "- Overdue Work Orders: %d\n" +
                "- Completion Percentage: %.2f%%\n\n" +
                "Provide:\n" +
                "1. Executive Summary\n" +
                "2. Risks\n" +
                "3. Opportunities\n" +
                "4. Recommendations\n",
                request.getGeneratedDate() != null ? request.getGeneratedDate().toString() : "N/A",
                ar.getTotalDeals(),
                ar.getWonDeals(),
                ar.getLostDeals(),
                ar.getOpenDeals(),
                ar.getTotalPipelineValue() != null ? ar.getTotalPipelineValue().toPlainString() : "0.00",
                ar.getAverageDealValue() != null ? ar.getAverageDealValue().toPlainString() : "0.00",
                ar.getTotalWorkOrders(),
                ar.getCompletedWorkOrders(),
                ar.getPendingWorkOrders(),
                ar.getOverdueWorkOrders(),
                ar.getCompletionPercentage()
        );
    }
}
