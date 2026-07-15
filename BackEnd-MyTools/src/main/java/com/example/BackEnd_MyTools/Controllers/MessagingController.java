package com.example.BackEnd_MyTools.Controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.example.BackEnd_MyTools.DTO.SendMessageRequest;
import com.example.BackEnd_MyTools.DTO.StartConversationRequest;
import com.example.BackEnd_MyTools.Entitys.ChatMessage;
import com.example.BackEnd_MyTools.Entitys.Conversation;
import com.example.BackEnd_MyTools.Security.SecurityUtils;
import com.example.BackEnd_MyTools.Services.MessagingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessagingController {
    private final MessagingService messagingService;

    @PostMapping("/start")
    public ResponseEntity<ChatMessage> startFromResource(
            @RequestBody StartConversationRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(messagingService.startFromResource(jwt, request));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<Conversation>> conversations(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(messagingService.myConversations(SecurityUtils.currentUserId(jwt)));
    }

    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<List<ChatMessage>> messages(@PathVariable String conversationId,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(messagingService.messages(conversationId, jwt));
    }

    @PostMapping
    public ResponseEntity<ChatMessage> send(@RequestBody SendMessageRequest request, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(messagingService.send(jwt, request));
    }
}
