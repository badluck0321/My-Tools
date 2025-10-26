package com.example.BackEnd_MyTools.Logging;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import static com.example.BackEnd_MyTools.Security.SecurityConfig.getUserInfo;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoggingService {
    
    private final MongoTemplate mongoTemplate;

    /**
     * Logs EVERY incoming request - ALWAYS saves to MongoDB
     */
    public void logCompleteRequest(HttpServletRequest request) {
        try {
            LogEntry logEntry = new LogEntry();
            
            // Capture request details
            logEntry.setMethod(request.getMethod());
            logEntry.setEndpoint(request.getRequestURI());
            logEntry.setRequestParams(request.getQueryString());
            logEntry.setClientIp(getClientIp(request));
            // logEntry.setUserAgent(request.getHeader("User-Agent"));
            logEntry.setTimestamp(LocalDateTime.now());
            
            // User information from Keycloak
            String username = getUserInfo();
            logEntry.setUsername(username);
            
            // Categorize the request type
            logEntry.setApplication(categorizeRequest(request.getRequestURI()));
            
            // ⭐ ALWAYS SAVE TO MONGODB - regardless of log level
            mongoTemplate.save(logEntry);
            request.setAttribute("logEntryId", logEntry.getId());
            request.setAttribute("startTime", System.currentTimeMillis());
            
            // ⭐ INTELLIGENT CONSOLE LOGGING - depends on log level
            if (isImportantRequest(request)) {
                // Business APIs always visible in production
                log.info("📥 REQUEST: {} {} - User: {} - IP: {}", 
                    request.getMethod(), request.getRequestURI(),
                    username, getClientIp(request));
            } else {
                // Documentation/health checks only visible in DEBUG mode
                log.debug("📥 Request: {} {} - User: {}", 
                    request.getMethod(), request.getRequestURI(), username);
            }
            
        } catch (Exception e) {
            log.error("❌ Failed to log request: {} {}", 
                request.getMethod(), request.getRequestURI());
        }
    }
    
    /**
     * Logs EVERY response - ALWAYS updates MongoDB
     */
    public void logCompleteResponse(HttpServletRequest request, HttpServletResponse response, long duration) {
        try {
            String logEntryId = (String) request.getAttribute("logEntryId");
            if (logEntryId != null) {
                LogEntry logEntry = mongoTemplate.findById(logEntryId, LogEntry.class);
                if (logEntry != null) {
                    // ⭐ ALWAYS UPDATE MONGODB
                    logEntry.setStatusCode(response.getStatus());
                    logEntry.setDurationMs(duration);
                    mongoTemplate.save(logEntry);
                    
                    // ⭐ INTELLIGENT CONSOLE LOGGING
                    if (response.getStatus() >= 400) {
                        // Errors always visible
                        log.error("❌ ERROR: {} {} - Status: {} - Duration: {}ms", 
                            request.getMethod(), request.getRequestURI(),
                            response.getStatus(), duration);
                    } else if (duration > 5000) {
                        // Slow requests always visible as warnings
                        log.warn("⚠️ SLOW: {} {} - Status: {} - Duration: {}ms", 
                            request.getMethod(), request.getRequestURI(),
                            response.getStatus(), duration);
                    } else if (isImportantRequest(request)) {
                        // Business APIs visible in production
                        log.info("✅ SUCCESS: {} {} - Status: {} - Duration: {}ms", 
                            request.getMethod(), request.getRequestURI(),
                            response.getStatus(), duration);
                    } else {
                        // Other requests only in DEBUG mode
                        log.debug("✅ Response: {} {} - Status: {} - Duration: {}ms", 
                            request.getMethod(), request.getRequestURI(),
                            response.getStatus(), duration);
                    }
                }
            }
        } catch (Exception e) {
            log.error("❌ Failed to log response: {} {}", 
                request.getMethod(), request.getRequestURI());
        }
    }
    
    /**
     * Logs errors - ALWAYS saves full details to MongoDB and console
     */
    public void logError(HttpServletRequest request, HttpServletResponse response, Exception ex, long duration) {
        try {
            String logEntryId = (String) request.getAttribute("logEntryId");
            LogEntry logEntry;
            
            if (logEntryId != null) {
                logEntry = mongoTemplate.findById(logEntryId, LogEntry.class);
            } else {
                logEntry = new LogEntry();
                logEntry.setMethod(request.getMethod());
                logEntry.setEndpoint(request.getRequestURI());
                logEntry.setClientIp(getClientIp(request));
                logEntry.setUsername(getUserInfo());
                logEntry.setApplication(categorizeRequest(request.getRequestURI()));
                logEntry.setTimestamp(LocalDateTime.now());
            }
            
            if (logEntry != null) {
                // ⭐ ALWAYS SAVE COMPLETE ERROR DETAILS TO MONGODB
                logEntry.setStatusCode(response != null ? response.getStatus() : 500);
                logEntry.setDurationMs(duration);
                logEntry.setErrorMessage(ex.getMessage());
                logEntry.setStackTrace(getStackTrace(ex));
                mongoTemplate.save(logEntry);
                
                // ⭐ ALWAYS LOG ERRORS TO CONSOLE (with stack trace in log file)
                log.error("💥 EXCEPTION: {} {} - Status: {} - Error: {} - Duration: {}ms - User: {} - IP: {}", 
                    request.getMethod(), request.getRequestURI(),
                    response != null ? response.getStatus() : 500,
                    ex.getMessage(), duration, getUserInfo(), getClientIp(request),
                    ex); // Stack trace goes to log file
            }
        } catch (Exception e) {
            log.error("❌ Failed to log error: {} {}", 
                request.getMethod(), request.getRequestURI());
        }
    }
    
    // Helper methods
    private boolean isImportantRequest(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/") || 
               path.equals("/products") || 
               path.startsWith("/users") ||
               request.getMethod().equals("POST") || 
               request.getMethod().equals("PUT") || 
               request.getMethod().equals("DELETE");
    }
    
    private String categorizeRequest(String uri) {
        if (uri.contains("/v3/api-docs") || uri.contains("/swagger")) return "SpringDoc";
        if (uri.contains("/actuator")) return "Actuator";
        if (uri.startsWith("/api/") || uri.equals("/products")) return "BusinessAPI";
        if (uri.endsWith(".css") || uri.endsWith(".js") || uri.endsWith(".ico")) return "Static";
        return "Other";
    }
    
    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        return (xfHeader != null) ? xfHeader.split(",")[0] : request.getRemoteAddr();
    }
    
    private String getStackTrace(Exception ex) {
        StringBuilder sb = new StringBuilder();
        for (StackTraceElement element : ex.getStackTrace()) {
            sb.append(element.toString()).append("\n");
        }
        return sb.toString();
    }
}


////////////// old code //////////////
/// 


// package com.example.BackEnd_MyTools.Logging;

// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.data.mongodb.core.MongoTemplate;
// import org.springframework.stereotype.Service;
// import java.util.Enumeration;
// import java.util.HashMap;
// import java.util.Map;

// import static com.example.BackEnd_MyTools.Security.SecurityConfig.getUserInfo;

// @Slf4j
// @Service
// @RequiredArgsConstructor
// public class LoggingService {
    
//     private final MongoTemplate mongoTemplate;

//     public void logCompleteRequest(HttpServletRequest request) {
//         try {
//             LogEntry logEntry = new LogEntry();
            
//             // Basic request info
//             logEntry.setMethod(request.getMethod());
//             logEntry.setEndpoint(request.getRequestURI());
//             logEntry.setRequestParams(request.getQueryString());
//             logEntry.setClientIp(getClientIp(request));
//             logEntry.setUserAgent(request.getHeader("User-Agent"));
            
//             // User info
//             String username = getUserInfo();
//             logEntry.setUsername(username);
            
//             // Request headers
//             logEntry.setRequestHeaders(extractHeaders(request));
            
//             // Categorize the request
//             logEntry.setApplication(categorizeRequest(request.getRequestURI()));
            
//             // Store in request for later update
//             mongoTemplate.save(logEntry);
//             request.setAttribute("logEntryId", logEntry.getId());
            
//             // Console log
//             System.out.printf("📥 [%s] %s %s - User: %s%n", 
//                 logEntry.getApplication(), 
//                 request.getMethod(), 
//                 request.getRequestURI(),
//                 username);
                
//         } catch (Exception e) {
//             log.error("Failed to log request", e);
//         }
//     }
    
//     public void logCompleteResponse(HttpServletRequest request, HttpServletResponse response, long duration) {
//         try {
//             String logEntryId = (String) request.getAttribute("logEntryId");
//             if (logEntryId != null) {
//                 LogEntry logEntry = mongoTemplate.findById(logEntryId, LogEntry.class);
//                 if (logEntry != null) {
//                     // Update with response info
//                     logEntry.setStatusCode(response.getStatus());
//                     logEntry.setDurationMs(duration);
//                     logEntry.setResponseHeaders(extractResponseHeaders(response));
                    
//                     mongoTemplate.save(logEntry);
                    
//                     // Console log
//                     String statusEmoji = response.getStatus() >= 400 ? "❌" : "✅";
//                     System.out.printf("%s [%s] %s %s (%d) %dms%n", 
//                         statusEmoji,
//                         logEntry.getApplication(), 
//                         request.getMethod(), 
//                         request.getRequestURI(),
//                         response.getStatus(),
//                         duration);
//                 }
//             } else {
//                 // Create new entry if filter missed it
//                 LogEntry logEntry = new LogEntry();
//                 logEntry.setMethod(request.getMethod());
//                 logEntry.setEndpoint(request.getRequestURI());
//                 logEntry.setStatusCode(response.getStatus());
//                 logEntry.setDurationMs(duration);
//                 logEntry.setClientIp(getClientIp(request));
//                 logEntry.setUsername(getUserInfo());
//                 logEntry.setApplication(categorizeRequest(request.getRequestURI()));
                
//                 mongoTemplate.save(logEntry);
                
//                 System.out.printf("🆕 [%s] %s %s (%d) %dms%n", 
//                     logEntry.getApplication(), 
//                     request.getMethod(), 
//                     request.getRequestURI(),
//                     response.getStatus(),
//                     duration);
//             }
//         } catch (Exception e) {
//             log.error("Failed to log response", e);
//         }
//     }
    
//     public void logError(HttpServletRequest request, HttpServletResponse response, Exception ex, long duration) {
//         try {
//             String logEntryId = (String) request.getAttribute("logEntryId");
//             LogEntry logEntry;
            
//             if (logEntryId != null) {
//                 logEntry = mongoTemplate.findById(logEntryId, LogEntry.class);
//             } else {
//                 logEntry = new LogEntry();
//                 logEntry.setMethod(request.getMethod());
//                 logEntry.setEndpoint(request.getRequestURI());
//                 logEntry.setClientIp(getClientIp(request));
//                 logEntry.setUsername(getUserInfo());
//                 logEntry.setApplication(categorizeRequest(request.getRequestURI()));
//             }
            
//             if (logEntry != null) {
//                 logEntry.setStatusCode(response != null ? response.getStatus() : 500);
//                 logEntry.setDurationMs(duration);
//                 logEntry.setErrorMessage(ex.getMessage());
//                 logEntry.setStackTrace(getStackTrace(ex));
                
//                 mongoTemplate.save(logEntry);
                
//                 // Console error log
//                 System.err.printf("💥 [%s] %s %s - ERROR: %s - %dms%n", 
//                     logEntry.getApplication(), 
//                     request.getMethod(), 
//                     request.getRequestURI(),
//                     ex.getMessage(),
//                     duration);
//             }
//         } catch (Exception e) {
//             log.error("Failed to log error", e);
//         }
//     }
    
//     private String categorizeRequest(String uri) {
//         if (uri.contains("/v3/api-docs") || uri.contains("/swagger")) {
//             return "SpringDoc";
//         } else if (uri.contains("/actuator")) {
//             return "Actuator";
//         } else if (uri.contains("/api/") || uri.matches("/[a-zA-Z]+")) {
//             return "YourAPI";
//         } else if (uri.endsWith(".css") || uri.endsWith(".js") || uri.endsWith(".ico")) {
//             return "Static";
//         } else {
//             return "Other";
//         }
//     }
    
//     private String extractHeaders(HttpServletRequest request) {
//         Map<String, String> headers = new HashMap<>();
//         Enumeration<String> headerNames = request.getHeaderNames();
//         while (headerNames.hasMoreElements()) {
//             String headerName = headerNames.nextElement();
//             headers.put(headerName, request.getHeader(headerName));
//         }
//         return headers.toString();
//     }
    
//     private String extractResponseHeaders(HttpServletResponse response) {
//         Map<String, String> headers = new HashMap<>();
//         for (String headerName : response.getHeaderNames()) {
//             headers.put(headerName, response.getHeader(headerName));
//         }
//         return headers.toString();
//     }
    
//     private String getClientIp(HttpServletRequest request) {
//         String xfHeader = request.getHeader("X-Forwarded-For");
//         if (xfHeader != null) {
//             return xfHeader.split(",")[0];
//         }
//         return request.getRemoteAddr();
//     }
    
//     private String getStackTrace(Exception ex) {
//         StringBuilder sb = new StringBuilder();
//         for (StackTraceElement element : ex.getStackTrace()) {
//             sb.append(element.toString()).append("\n");
//         }
//         return sb.toString();
//     }
// }


