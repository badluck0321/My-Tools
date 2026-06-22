package com.example.BackEnd_MyTools.Kafka;

import com.example.BackEnd_MyTools.Kafka.Events.NotificationEvent;
import com.example.BackEnd_MyTools.Kafka.Events.OrderEvent;
import com.example.BackEnd_MyTools.Kafka.Events.MessageEvent;
import com.example.BackEnd_MyTools.Services.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaConsumerService {
    private final NotificationService notificationService;

    @KafkaListener(topics = KafkaTopics.NOTIFICATIONS, groupId = "mytools-group")
    public void handleNotification(NotificationEvent event) {
        notificationService.create(event.getUserId(), event.getType(), event.getTitle(), event.getMessage(), event.getReferenceId());
        log.info("Notification persisted → userId={} type={}", event.getUserId(), event.getType());
    }

    @KafkaListener(topics = KafkaTopics.ORDERS, groupId = "mytools-group")
    public void handleOrder(OrderEvent event) {
        log.info("Order event received → orderId={} status={}", event.getOrderId(), event.getStatus());
    }

    @KafkaListener(topics = KafkaTopics.MESSAGES, groupId = "mytools-group")
    public void handleMessage(MessageEvent event) {
        notificationService.create(event.getRecipientId(), "MESSAGE", "New message", event.getContent(), event.getConversationId());
        log.info("Message event received → conversationId={}", event.getConversationId());
    }
}
