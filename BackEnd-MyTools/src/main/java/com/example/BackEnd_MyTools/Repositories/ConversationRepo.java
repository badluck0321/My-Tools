package com.example.BackEnd_MyTools.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.BackEnd_MyTools.Entitys.Conversation;

@Repository
public interface ConversationRepo extends MongoRepository<Conversation, String> {
    @Query("{ 'participantIds': ?0 }")
    List<Conversation> findByParticipantId(String participantId);

    Optional<Conversation> findByResourceIdAndParticipantIds(String resourceId, String senderId, String ownerId);
}
