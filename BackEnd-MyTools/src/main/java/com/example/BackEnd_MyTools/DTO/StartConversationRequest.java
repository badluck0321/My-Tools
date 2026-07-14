package com.example.BackEnd_MyTools.DTO;

import lombok.Data;

@Data
public class StartConversationRequest {
    private String resourceType; // "PRODUCT", "MASTERY", "DEMANDE"
    private String resourceId;
    private String initialMessage;
}