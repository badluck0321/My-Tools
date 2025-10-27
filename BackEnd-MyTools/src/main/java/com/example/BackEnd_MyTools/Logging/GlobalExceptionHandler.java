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

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(HttpServletRequest request,
            HttpServletResponse response,
            Exception ex) {
        try {
            // compute duration if startTime exists (set by your LoggingService)
            Object st = request.getAttribute("startTime");
            long duration = 0;
            if (st instanceof Long) {
                duration = System.currentTimeMillis() - (Long) st;
            }

            String uri = request.getRequestURI();
            // Avoid logging recursion or noisy third-party endpoints (swagger, actuator,
            // openapi)
            if (uri != null
                    && (uri.contains("/v3/api-docs") || uri.contains("/swagger") || uri.contains("/actuator"))) {
                // minimal logging to console only
                loggingService.logErrorMinimal(request, response, ex, duration);
            } else {
                // full logging for business endpoints
                loggingService.logError(request, response, ex, duration);
            }
        } catch (Exception logEx) {
            // If logging itself fails, do not rethrow; write minimal console message
            System.err.println("Failed to log exception: " + logEx.getMessage());
        }

        // make sure the response status is 500
        if (!response.isCommitted()) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Internal server error (see logs).");
    }
}

// --------------------old

// package com.example.BackEnd_MyTools.Logging;

// import jakarta.servlet.http.HttpServletRequest;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.ControllerAdvice;
// import org.springframework.web.bind.annotation.ExceptionHandler;

// @ControllerAdvice
// @RequiredArgsConstructor
// public class GlobalExceptionHandler {

// private final LoggingService loggingService;

// @ExceptionHandler(Exception.class)
// public ResponseEntity<String> handleException(HttpServletRequest request,
// Exception ex) {
// long duration = 0;
// loggingService.logError(request, null, ex, duration);
// return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
// .body("Internal server error (see logs).");
// }
// }
