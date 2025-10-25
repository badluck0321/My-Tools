package com.example.BackEnd_MyTools.Logging;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "api_logs")
public class LogEntry {
    @Id
    private String id;
    private String method;           // GET, POST, PUT, DELETE
    private String endpoint;         // /api/products, /v3/api-docs, etc.
    private String requestParams;    // ?page=1&size=10
    private String requestBody;      // JSON sent to your API
    private String responseBody;     // JSON returned from your API
    private Integer statusCode;      // 200, 404, 500, etc.
    private Long durationMs;         // How long the request took
    private String clientIp;         // User's IP address
    private String username;         // From Keycloak
    private String userEmail;        // From Keycloak (if available)
    private String userRoles;        // From Keycloak (if available)
    private LocalDateTime timestamp; // When it happened
    private String errorMessage;     // Error description
    private String stackTrace;       // Full error details
    private String application;      // "BusinessAPI", "SpringDoc", "Actuator"

    public LogEntry() {
        this.timestamp = LocalDateTime.now();
    }
}
// package com.example.BackEnd_MyTools.Logging;

// import org.springframework.data.annotation.Id;
// import org.springframework.data.mongodb.core.mapping.Document;
// import lombok.Data;

// @Document("logs")
// @Data
// public class LogEntry {
//     @Id
//     private String id;
//     private String method;
//     private String path;
//     private String username;
//     private int status;
//     private long durationMs;
//     private long timestamp;
// }
