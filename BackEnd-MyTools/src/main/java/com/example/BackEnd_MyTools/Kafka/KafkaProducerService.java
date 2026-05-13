package com.example.BackEnd_MyTools.Kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import com.example.BackEnd_MyTools.Kafka.Events.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducerService{

    private final KafkaTemplate<String, Object> kafkaTemplate;

    /* ── Notifications ── */
    public void sendNotification(String userId, String type,
                                  String title, String message,
                                  String referenceId) {
        NotificationEvent event = NotificationEvent.builder()
            .id(UUID.randomUUID().toString())
            .userId(userId)
            .type(type)
            .title(title)
            .message(message)
            .referenceId(referenceId)
            .createdAt(LocalDateTime.now())
            .build();

        kafkaTemplate.send(KafkaTopics.NOTIFICATIONS, userId, event);
        log.info("Notification sent → userId={} type={}", userId, type);
    }

    /* ── Orders ── */
    public void sendOrderEvent(OrderEvent event) {
        kafkaTemplate.send(KafkaTopics.ORDERS, event.getOrderId(), event);
        log.info("Order event sent → orderId={} status={}", event.getOrderId(), event.getStatus());
    }

    /* ── Activity ── */
    public void sendActivity(String userId, String action,
                              String resourceId, String resourceType) {
        ActivityEvent event = ActivityEvent.builder()
            .userId(userId)
            .action(action)
            .resourceId(resourceId)
            .resourceType(resourceType)
            .occurredAt(LocalDateTime.now())
            .build();

        kafkaTemplate.send(KafkaTopics.ACTIVITY, userId, event);
    }

    /* ── Analytics ── */
    public void sendAnalytics(String eventType, String userId,
                               Map<String, Object> metadata) {
        AnalyticsEvent event = AnalyticsEvent.builder()
            .eventType(eventType)
            .userId(userId)
            .occurredAt(LocalDateTime.now())
            .build();

        kafkaTemplate.send(KafkaTopics.ANALYTICS, userId, event);
    }

    /* ── Messages ── */
    public void sendMessage(MessageEvent event) {
        kafkaTemplate.send(KafkaTopics.MESSAGES, event.getConversationId(), event);
        log.info("Message sent → conversationId={}", event.getConversationId());
    }
}