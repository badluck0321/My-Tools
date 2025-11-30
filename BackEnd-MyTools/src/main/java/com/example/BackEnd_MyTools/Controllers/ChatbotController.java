package com.example.BackEnd_MyTools.Controllers;

import com.example.BackEnd_MyTools.DTO.ChatMessageRequest;
import com.example.BackEnd_MyTools.DTO.ChatMessageResponse;
import com.example.BackEnd_MyTools.Services.AIChatbotService;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.security.PermitAll;

@RestController
@PermitAll // allow anonymous (unauthenticated) access to this controller's
// endpoints
@RequestMapping("/api/chat")
public class ChatbotController {

    private final AIChatbotService aiChatbotService;

    public ChatbotController(AIChatbotService aiChatbotService) {
        this.aiChatbotService = aiChatbotService;
    }

    @PostMapping
    public ChatMessageResponse chat(@RequestBody ChatMessageRequest request) {
        String response = aiChatbotService.chat(request.message());
        return new ChatMessageResponse(response);
    }
}