package com.bi.dto;

import java.time.LocalDate;

public class WorkOrder {
    private String id;
    private String name;
    private String priority;
    private String status;
    private LocalDate dueDate;
    private String relatedDealId;

    public WorkOrder() {
    }

    public WorkOrder(String id, String name, String priority, String status, LocalDate dueDate, String relatedDealId) {
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.status = status;
        this.dueDate = dueDate;
        this.relatedDealId = relatedDealId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getRelatedDealId() {
        return relatedDealId;
    }

    public void setRelatedDealId(String relatedDealId) {
        this.relatedDealId = relatedDealId;
    }
}
