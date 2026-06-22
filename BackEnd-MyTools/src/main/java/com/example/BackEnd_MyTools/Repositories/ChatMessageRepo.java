package com.example.BackEnd_MyTools.Repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.BackEnd_MyTools.Entitys.ChatMessage;

@Repository
public interface ChatMessageRepo extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByConversationIdOrderByCreatedAtAsc(String conversationId);
}
