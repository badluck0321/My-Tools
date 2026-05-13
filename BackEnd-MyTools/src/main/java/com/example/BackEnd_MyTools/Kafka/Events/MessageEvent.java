package com.example.BackEnd_MyTools.Kafka.Events;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MessageEvent {
    private String messageId;
    private String senderId;
    private String recipientId;
    private String content;
    private String conversationId;
    private LocalDateTime sentAt;
}