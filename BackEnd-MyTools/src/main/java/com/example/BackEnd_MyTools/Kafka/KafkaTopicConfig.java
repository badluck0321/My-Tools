package com.example.BackEnd_MyTools.Kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Bean public NewTopic notificationsTopic() {
        return TopicBuilder.name(KafkaTopics.NOTIFICATIONS).partitions(3).replicas(1).build();
    }
    @Bean public NewTopic ordersTopic() {
        return TopicBuilder.name(KafkaTopics.ORDERS).partitions(3).replicas(1).build();
    }
    @Bean public NewTopic activityTopic() {
        return TopicBuilder.name(KafkaTopics.ACTIVITY).partitions(3).replicas(1).build();
    }
    @Bean public NewTopic analyticsTopic() {
        return TopicBuilder.name(KafkaTopics.ANALYTICS).partitions(3).replicas(1).build();
    }
    @Bean public NewTopic messagesTopic() {
        return TopicBuilder.name(KafkaTopics.MESSAGES).partitions(3).replicas(1).build();
    }
}