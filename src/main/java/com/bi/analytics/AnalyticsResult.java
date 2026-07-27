package com.bi.analytics;

import java.math.BigDecimal;

public class AnalyticsResult {
    private int totalDeals;
    private int wonDeals;
    private int lostDeals;
    private int openDeals;
    private BigDecimal totalPipelineValue;
    private BigDecimal averageDealValue;

    private int totalWorkOrders;
    private int completedWorkOrders;
    private int pendingWorkOrders;
    private int overdueWorkOrders;
    private double completionPercentage;

    public AnalyticsResult() {
    }

    public AnalyticsResult(int totalDeals, int wonDeals, int lostDeals, int openDeals,
                           BigDecimal totalPipelineValue, BigDecimal averageDealValue,
                           int totalWorkOrders, int completedWorkOrders, int pendingWorkOrders,
                           int overdueWorkOrders, double completionPercentage) {
        this.totalDeals = totalDeals;
        this.wonDeals = wonDeals;
        this.lostDeals = lostDeals;
        this.openDeals = openDeals;
        this.totalPipelineValue = totalPipelineValue;
        this.averageDealValue = averageDealValue;
        this.totalWorkOrders = totalWorkOrders;
        this.completedWorkOrders = completedWorkOrders;
        this.pendingWorkOrders = pendingWorkOrders;
        this.overdueWorkOrders = overdueWorkOrders;
        this.completionPercentage = completionPercentage;
    }

    public int getTotalDeals() {
        return totalDeals;
    }

    public void setTotalDeals(int totalDeals) {
        this.totalDeals = totalDeals;
    }

    public int getWonDeals() {
        return wonDeals;
    }

    public void setWonDeals(int wonDeals) {
        this.wonDeals = wonDeals;
    }

    public int getLostDeals() {
        return lostDeals;
    }

    public void setLostDeals(int lostDeals) {
        this.lostDeals = lostDeals;
    }

    public int getOpenDeals() {
        return openDeals;
    }

    public void setOpenDeals(int openDeals) {
        this.openDeals = openDeals;
    }

    public BigDecimal getTotalPipelineValue() {
        return totalPipelineValue;
    }

    public void setTotalPipelineValue(BigDecimal totalPipelineValue) {
        this.totalPipelineValue = totalPipelineValue;
    }

    public BigDecimal getAverageDealValue() {
        return averageDealValue;
    }

    public void setAverageDealValue(BigDecimal averageDealValue) {
        this.averageDealValue = averageDealValue;
    }

    public int getTotalWorkOrders() {
        return totalWorkOrders;
    }

    public void setTotalWorkOrders(int totalWorkOrders) {
        this.totalWorkOrders = totalWorkOrders;
    }

    public int getCompletedWorkOrders() {
        return completedWorkOrders;
    }

    public void setCompletedWorkOrders(int completedWorkOrders) {
        this.completedWorkOrders = completedWorkOrders;
    }

    public int getPendingWorkOrders() {
        return pendingWorkOrders;
    }

    public void setPendingWorkOrders(int pendingWorkOrders) {
        this.pendingWorkOrders = pendingWorkOrders;
    }

    public int getOverdueWorkOrders() {
        return overdueWorkOrders;
    }

    public void setOverdueWorkOrders(int overdueWorkOrders) {
        this.overdueWorkOrders = overdueWorkOrders;
    }

    public double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }
}
