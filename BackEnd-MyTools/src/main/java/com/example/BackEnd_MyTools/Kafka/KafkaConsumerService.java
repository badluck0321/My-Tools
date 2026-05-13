// package com.example.BackEnd_MyTools.Kafka;

// import lombok.extern.slf4j.Slf4j;
// import org.springframework.kafka.annotation.KafkaListener;
// import org.springframework.stereotype.Service;
// import com.example.BackEnd_MyTools.Kafka.Events.*;

// @Slf4j
// @Service
// public class KafkaConsumerService {

//     /* ── Notifications ── */
//     @KafkaListener(topics = KafkaTopics.NOTIFICATIONS, groupId = "mytools-group")
//     public void handleNotification(NotificationEvent event) {
//         log.info("Notification received → userId={} type={} message={}",
//             event.getUserId(), event.getType(), event.getMessage());
//         // TODO: push via WebSocket to frontend
//         // TODO: persist to Notification collection in MongoDB
//     }

//     /* ── Orders ── */
//     @KafkaListener(topics = KafkaTopics.ORDERS, groupId = "mytools-group")
//     public void handleOrder(OrderEvent event) {
//         log.info("Order event received → orderId={} status={}",
//             event.getOrderId(), event.getStatus());
//         // TODO: update order status in DB
//         // TODO: send notification to buyer
//         // TODO: send notification to store owner
//     }

//     /* ── Activity ── */
//     @KafkaListener(topics = KafkaTopics.ACTIVITY, groupId = "mytools-group")
//     public void handleActivity(ActivityEvent event) {
//         log.info("Activity → userId={} action={} resource={}",
//             event.getUserId(), event.getAction(), event.getResourceId());
//         // TODO: persist to Activity collection
//         // TODO: update product view count
//     }

//     /* ── Analytics ── */
//     @KafkaListener(topics = KafkaTopics.ANALYTICS, groupId = "mytools-group")
//     public void handleAnalytics(AnalyticsEvent event) {
//         log.info("Analytics → type={} userId={}", event.getEventType(), event.getUserId());
//         // TODO: aggregate and persist to Analytics collection
//     }

//     /* ── Messages ── */
//     @KafkaListener(topics = KafkaTopics.MESSAGES, groupId = "mytools-group")
//     public void handleMessage(MessageEvent event) {
//         log.info("Message received → conversationId={} from={}",
//             event.getConversationId(), event.getSenderId());
//         // TODO: push via WebSocket to recipient
//         // TODO: persist to Message collection
//     }
// }