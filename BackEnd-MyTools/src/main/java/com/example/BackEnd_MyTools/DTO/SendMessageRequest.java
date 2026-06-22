package com.example.BackEnd_MyTools.DTO;

import lombok.Data;

@Data
public class SendMessageRequest {
    private String conversationId;
    private String receiverId;
    private String productId;
    private String body;
    private String photoUrls;
}
