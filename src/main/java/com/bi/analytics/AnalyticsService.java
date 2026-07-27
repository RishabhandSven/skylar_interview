package com.bi.analytics;

import com.bi.dto.Deal;
import com.bi.dto.WorkOrder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
public class AnalyticsService {

    public AnalyticsResult analyze(List<Deal> deals, List<WorkOrder> workOrders) {
        int totalDeals = 0;
        int wonDeals = 0;
        int lostDeals = 0;
        int openDeals = 0;
        BigDecimal totalPipelineValue = BigDecimal.ZERO;

        if (deals != null) {
            totalDeals = deals.size();
            for (Deal deal : deals) {
                if (deal == null) {
                    continue;
                }

                String status = deal.getStatus();
                if (status != null) {
                    if (Deal.STATUS_WON.equalsIgnoreCase(status.trim())) {
                        wonDeals++;
                    } else if (Deal.STATUS_LOST.equalsIgnoreCase(status.trim())) {
                        lostDeals++;
                    } else {
                        openDeals++;
                    }
                } else {
                    openDeals++;
                }

                BigDecimal val = deal.getDealValue();
                if (val != null) {
                    totalPipelineValue = totalPipelineValue.add(val);
                }
            }
        }

        BigDecimal averageDealValue = BigDecimal.ZERO;
        if (totalDeals > 0) {
            averageDealValue = totalPipelineValue.divide(BigDecimal.valueOf(totalDeals), 2, RoundingMode.HALF_UP);
        }

        int totalWorkOrders = 0;
        int completedWorkOrders = 0;
        int pendingWorkOrders = 0;
        int overdueWorkOrders = 0;
        LocalDate today = LocalDate.now();

        if (workOrders != null) {
            totalWorkOrders = workOrders.size();
            for (WorkOrder wo : workOrders) {
                if (wo == null) {
                    continue;
                }

                String status = wo.getStatus();
                boolean isCompleted = false;
                if (status != null && "completed".equalsIgnoreCase(status.trim())) {
                    completedWorkOrders++;
                    isCompleted = true;
                } else {
                    pendingWorkOrders++;
                }

                if (!isCompleted) {
                    LocalDate dueDate = wo.getDueDate();
                    if (dueDate != null && dueDate.isBefore(today)) {
                        overdueWorkOrders++;
                    }
                }
            }
        }

        double completionPercentage = 0.0;
        if (totalWorkOrders > 0) {
            completionPercentage = (completedWorkOrders * 100.0) / totalWorkOrders;
        }

        return new AnalyticsResult(
                totalDeals,
                wonDeals,
                lostDeals,
                openDeals,
                totalPipelineValue,
                averageDealValue,
                totalWorkOrders,
                completedWorkOrders,
                pendingWorkOrders,
                overdueWorkOrders,
                completionPercentage
        );
    }
}
