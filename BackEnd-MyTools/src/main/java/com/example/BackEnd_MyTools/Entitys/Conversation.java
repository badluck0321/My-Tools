package com.example.BackEnd_MyTools.Entitys;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "Conversation")
@Data
public class Conversation {
    @Id
    private String id;
    private List<String> participantIds = new ArrayList<>();
    private String lastMessage;
    private String resourceType;
    private String resourceId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
