package com.example.BackEnd_MyTools.Logging;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document("logs")
@Data
public class LogEntry {
    @Id
    private String id;
    private String method;
    private String path;
    private String username;
    private int status;
    private long durationMs;
    private long timestamp;
}
