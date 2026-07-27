package com.bi.monday;

import com.bi.dto.RawBoardItem;
import com.bi.dto.Deal;
import com.bi.dto.WorkOrder;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.stereotype.Component;

@Component
public class MondayItemMapper {

    private static final String DEAL_STAGE = "deal_stage";
    private static final String DEAL_OWNER = "owner";
    private static final String DEAL_VALUE = "deal_value";
    private static final String DEAL_CLOSE_DATE = "deal_expected_close_date";
    private static final String DEAL_STATUS = "status";

    private static final String WO_PRIORITY = "priority";
    private static final String WO_STATUS = "status";
    private static final String WO_DUE_DATE = "due_date";
    private static final String WO_RELATED_DEAL = "link_to_deals";

    public Deal mapToDeal(RawBoardItem item) {
        if (item == null) {
            return null;
        }
        String id = item.getId();
        String name = item.getName();
        String stage = getColumnText(item, DEAL_STAGE);
        String ownerName = getColumnText(item, DEAL_OWNER);
        BigDecimal dealValue = parseBigDecimal(getColumnText(item, DEAL_VALUE));
        LocalDate closeDate = parseDate(getColumnText(item, DEAL_CLOSE_DATE));
        String status = getColumnText(item, DEAL_STATUS);

        return new Deal(id, name, stage, ownerName, dealValue, closeDate, status);
    }

    public WorkOrder mapToWorkOrder(RawBoardItem item) {
        if (item == null) {
            return null;
        }
        String id = item.getId();
        String name = item.getName();
        String priority = getColumnText(item, WO_PRIORITY);
        String status = getColumnText(item, WO_STATUS);
        LocalDate dueDate = parseDate(getColumnText(item, WO_DUE_DATE));
        String relatedDealId = getColumnText(item, WO_RELATED_DEAL);

        return new WorkOrder(id, name, priority, status, dueDate, relatedDealId);
    }

    private String getColumnText(RawBoardItem item, String columnId) {
        if (item == null || columnId == null || item.getColumnValues() == null) {
            return null;
        }
        for (RawBoardItem.RawColumnValue cv : item.getColumnValues()) {
            if (columnId.equals(cv.getId())) {
                return cv.getText();
            }
        }
        return null;
    }

    private String getColumnValue(RawBoardItem item, String columnId) {
        if (item == null || columnId == null || item.getColumnValues() == null) {
            return null;
        }
        for (RawBoardItem.RawColumnValue cv : item.getColumnValues()) {
            if (columnId.equals(cv.getId())) {
                return cv.getValue();
            }
        }
        return null;
    }

    private LocalDate parseDate(String dateText) {
        if (dateText == null || dateText.isBlank()) {
            return null;
        }
        try {
            return java.time.LocalDate.parse(dateText.trim());
        } catch (Exception e) {
            return null;
        }
    }

    private BigDecimal parseBigDecimal(String numberText) {
        if (numberText == null || numberText.isBlank()) {
            return null;
        }
        try {
            String cleaned = numberText.replaceAll("[^0-9.\\-]", "");
            return new BigDecimal(cleaned);
        } catch (Exception e) {
            return null;
        }
    }
}
