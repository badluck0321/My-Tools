package com.example.BackEnd_MyTools.Entitys;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "ChatMessage")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {
    @Id
    private String id;
    private String conversationId;
    private String senderId;
    private String receiverId;
    private String body;
    private String photoUrls;
    private boolean read;
    private LocalDateTime createdAt;
}
