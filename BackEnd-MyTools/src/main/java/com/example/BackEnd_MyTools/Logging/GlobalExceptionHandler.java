package com.example.BackEnd_MyTools.Logging;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final LoggingService loggingService;

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<String> handleForbidden(SecurityException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(HttpServletRequest request, HttpServletResponse response, Exception ex) {
        try {
            Object st = request.getAttribute("startTime");
            long duration = st instanceof Long ? System.currentTimeMillis() - (Long) st : 0;
            String uri = request.getRequestURI();
            if (uri != null && (uri.contains("/v3/api-docs") || uri.contains("/swagger") || uri.contains("/actuator"))) {
                loggingService.logErrorMinimal(request, response, ex, duration);
            } else {
                loggingService.logError(request, response, ex, duration);
            }
        } catch (Exception logEx) {
            System.err.println("Failed to log exception: " + logEx.getMessage());
        }
        if (!response.isCommitted()) response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error: " + ex.getMessage());
    }
}
