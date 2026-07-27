package com.bi.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MondayApiException.class)
    public ResponseEntity<Map<String, String>> handleMondayApiException(MondayApiException ex) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(Map.of(
                        "error", "Bad Gateway",
                        "message", ex.getMessage() != null ? ex.getMessage() : "Failed to communicate with Monday.com API"
                ));
    }

    @ExceptionHandler(org.springframework.web.reactive.function.client.WebClientResponseException.class)
    public ResponseEntity<Map<String, String>> handleWebClientResponseException(org.springframework.web.reactive.function.client.WebClientResponseException ex) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(Map.of(
                        "error", "Bad Gateway",
                        "message", "Downstream service returned error: " + ex.getStatusCode()
                ));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalStateException(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "error", "Configuration Error",
                        "message", ex.getMessage() != null ? ex.getMessage() : "System state invalid"
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "error", "Internal Server Error",
                        "message", ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred"
                ));
    }
}
