package com.example.BackEnd_MyTools.Services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.Entitys.Notification;
import com.example.BackEnd_MyTools.Repositories.NotificationRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepo notificationRepo;
    private final ObjectProvider<SimpMessagingTemplate> messagingTemplateProvider;

    public Notification create(String userId, String type, String title, String message, String referenceId) {
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("Notification userId is required");
        }
        Notification notification = Notification.builder()
            .userId(userId)
            .type(type)
            .title(title)
            .message(message)
            .referenceId(referenceId)
            .read(false)
            .createdAt(LocalDateTime.now())
            .build();
        Notification saved = notificationRepo.save(notification);
        SimpMessagingTemplate messagingTemplate = messagingTemplateProvider.getIfAvailable();
        if (messagingTemplate != null) {
            messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", saved);
        }
        return saved;
    }

    public List<Notification> listForUser(String userId) {
        return notificationRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long unreadCount(String userId) {
        return notificationRepo.countByUserIdAndReadFalse(userId);
    }

    public Notification markRead(String notificationId, String userId) {
        Notification notification = notificationRepo.findById(notificationId)
            .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        if (!notification.getUserId().equals(userId)) {
            throw new SecurityException("You can only update your own notifications");
        }
        notification.setRead(true);
        return notificationRepo.save(notification);
    }

    public void markAllRead(String userId) {
        List<Notification> notifications = notificationRepo.findByUserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepo.saveAll(notifications);
    }
}
