package com.bi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class RawBoardItem {
    private String id;
    private String name;

    @JsonProperty("column_values")
    private List<RawColumnValue> columnValues;

    public RawBoardItem() {
    }

    public RawBoardItem(String id, String name, List<RawColumnValue> columnValues) {
        this.id = id;
        this.name = name;
        this.columnValues = columnValues;
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

    public List<RawColumnValue> getColumnValues() {
        return columnValues;
    }

    public void setColumnValues(List<RawColumnValue> columnValues) {
        this.columnValues = columnValues;
    }

    public static class RawColumnValue {
        private String id;
        private String text;
        private String value;

        public RawColumnValue() {
        }

        public RawColumnValue(String id, String text, String value) {
            this.id = id;
            this.text = text;
            this.value = value;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }
    }
}
