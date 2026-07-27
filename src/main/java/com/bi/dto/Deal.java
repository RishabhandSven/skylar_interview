package com.bi.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Deal {
    public static final String STATUS_WON = "won";
    public static final String STATUS_LOST = "lost";

    private String id;
    private String name;
    private String stage;
    private String ownerName;
    private BigDecimal dealValue;
    private LocalDate closeDate;
    private String status;

    public Deal() {
    }

    public Deal(String id, String name, String stage, String ownerName, BigDecimal dealValue, LocalDate closeDate, String status) {
        this.id = id;
        this.name = name;
        this.stage = stage;
        this.ownerName = ownerName;
        this.dealValue = dealValue;
        this.closeDate = closeDate;
        this.status = status;
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

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public BigDecimal getDealValue() {
        return dealValue;
    }

    public void setDealValue(BigDecimal dealValue) {
        this.dealValue = dealValue;
    }

    public LocalDate getCloseDate() {
        return closeDate;
    }

    public void setCloseDate(LocalDate closeDate) {
        this.closeDate = closeDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
