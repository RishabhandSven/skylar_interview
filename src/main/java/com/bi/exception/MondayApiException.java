package com.bi.exception;

public class MondayApiException extends RuntimeException {
    public MondayApiException(String message) {
        super(message);
    }

    public MondayApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
