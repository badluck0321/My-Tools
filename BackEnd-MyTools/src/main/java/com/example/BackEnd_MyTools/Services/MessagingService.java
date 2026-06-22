package com.example.BackEnd_MyTools.Services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.DTO.SendMessageRequest;
import com.example.BackEnd_MyTools.Entitys.ChatMessage;
import com.example.BackEnd_MyTools.Entitys.Conversation;
import com.example.BackEnd_MyTools.Repositories.ChatMessageRepo;
import com.example.BackEnd_MyTools.Repositories.ConversationRepo;
import com.example.BackEnd_MyTools.Security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessagingService {
    private final ConversationRepo conversationRepo;
    private final ChatMessageRepo chatMessageRepo;
    private final NotificationService notificationService;

    public List<Conversation> myConversations(String userId) {
        List<Conversation> conversations = new ArrayList<>(conversationRepo.findByParticipantId(userId));
        conversations.sort((a, b) -> {
            if (a.getUpdatedAt() == null && b.getUpdatedAt() == null)
                return 0;
            if (a.getUpdatedAt() == null)
                return 1;
            if (b.getUpdatedAt() == null)
                return -1;
            return b.getUpdatedAt().compareTo(a.getUpdatedAt());
        });
        return conversations;
    }

    public List<ChatMessage> messages(String conversationId, Jwt jwt) {
        String userId = SecurityUtils.currentUserId(jwt);
        Conversation conversation = conversationRepo.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));
        if (!conversation.getParticipantIds().contains(userId))
            throw new SecurityException("You cannot read this conversation");
        return chatMessageRepo.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }

    public ChatMessage send(Jwt jwt, SendMessageRequest request) {
        String senderId = SecurityUtils.currentUserId(jwt);
        if (request.getBody() == null || request.getBody().isBlank())
            throw new IllegalArgumentException("Message body is required");
        Conversation conversation = resolveConversation(senderId, request);
        String receiverId = conversation.getParticipantIds().stream().filter(id -> !id.equals(senderId)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Receiver is required"));
        ChatMessage message = ChatMessage.builder()
                .conversationId(conversation.getId())
                .senderId(senderId)
                .receiverId(receiverId)
                .body(request.getBody())
                .photoUrls(request.getPhotoUrls())
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
        ChatMessage saved = chatMessageRepo.save(message);
        conversation.setLastMessage(request.getBody());
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepo.save(conversation);
        notificationService.create(receiverId, "MESSAGE", "New message", request.getBody(), conversation.getId());
        return saved;
    }

    private Conversation resolveConversation(String senderId, SendMessageRequest request) {
        if (request.getConversationId() != null && !request.getConversationId().isBlank()) {
            Conversation conversation = conversationRepo.findById(request.getConversationId())
                    .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));
            if (!conversation.getParticipantIds().contains(senderId))
                throw new SecurityException("You cannot access this conversation");
            return conversation;
        }
        if (request.getReceiverId() == null || request.getReceiverId().isBlank())
            throw new IllegalArgumentException("receiverId is required for a new conversation");
        Conversation conversation = new Conversation();
        conversation.getParticipantIds().add(senderId);
        conversation.getParticipantIds().add(request.getReceiverId());
        conversation.setProductId(request.getProductId());
        conversation.setCreatedAt(LocalDateTime.now());
        conversation.setUpdatedAt(LocalDateTime.now());
        return conversationRepo.save(conversation);
    }
}
