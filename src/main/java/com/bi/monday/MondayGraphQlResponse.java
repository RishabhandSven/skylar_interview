package com.bi.monday;

import com.bi.dto.RawBoardItem;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

public class MondayGraphQlResponse {

    private Data data;
    private List<GraphQlError> errors;

    public MondayGraphQlResponse() {
    }

    public MondayGraphQlResponse(Data data, List<GraphQlError> errors) {
        this.data = data;
        this.errors = errors;
    }

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }

    public List<GraphQlError> getErrors() {
        return errors;
    }

    public void setErrors(List<GraphQlError> errors) {
        this.errors = errors;
    }

    public static class Data {
        private List<BoardEnvelope> boards;

        @JsonProperty("next_items_page")
        private ItemsPageEnvelope nextItemsPage;

        public Data() {
        }

        public Data(List<BoardEnvelope> boards, ItemsPageEnvelope nextItemsPage) {
            this.boards = boards;
            this.nextItemsPage = nextItemsPage;
        }

        public List<BoardEnvelope> getBoards() {
            return boards;
        }

        public void setBoards(List<BoardEnvelope> boards) {
            this.boards = boards;
        }

        public ItemsPageEnvelope getNextItemsPage() {
            return nextItemsPage;
        }

        public void setNextItemsPage(ItemsPageEnvelope nextItemsPage) {
            this.nextItemsPage = nextItemsPage;
        }
    }

    public static class BoardEnvelope {
        private String id;

        @JsonProperty("items_page")
        private ItemsPageEnvelope itemsPage;

        public BoardEnvelope() {
        }

        public BoardEnvelope(String id, ItemsPageEnvelope itemsPage) {
            this.id = id;
            this.itemsPage = itemsPage;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public ItemsPageEnvelope getItemsPage() {
            return itemsPage;
        }

        public void setItemsPage(ItemsPageEnvelope itemsPage) {
            this.itemsPage = itemsPage;
        }
    }

    public static class ItemsPageEnvelope {
        private String cursor;
        private List<RawBoardItem> items;

        public ItemsPageEnvelope() {
        }

        public ItemsPageEnvelope(String cursor, List<RawBoardItem> items) {
            this.cursor = cursor;
            this.items = items;
        }

        public String getCursor() {
            return cursor;
        }

        public void setCursor(String cursor) {
            this.cursor = cursor;
        }

        public List<RawBoardItem> getItems() {
            return items;
        }

        public void setItems(List<RawBoardItem> items) {
            this.items = items;
        }
    }

    public static class GraphQlError {
        private String message;
        private List<Map<String, Object>> locations;
        private List<Object> path;
        private Map<String, Object> extensions;

        public GraphQlError() {
        }

        public GraphQlError(String message, List<Map<String, Object>> locations, List<Object> path, Map<String, Object> extensions) {
            this.message = message;
            this.locations = locations;
            this.path = path;
            this.extensions = extensions;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public List<Map<String, Object>> getLocations() {
            return locations;
        }

        public void setLocations(List<Map<String, Object>> locations) {
            this.locations = locations;
        }

        public List<Object> getPath() {
            return path;
        }

        public void setPath(List<Object> path) {
            this.path = path;
        }

        public Map<String, Object> getExtensions() {
            return extensions;
        }

        public void setExtensions(Map<String, Object> extensions) {
            this.extensions = extensions;
        }
    }
}
