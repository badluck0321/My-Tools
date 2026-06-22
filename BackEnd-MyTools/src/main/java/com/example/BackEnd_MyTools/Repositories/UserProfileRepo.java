package com.example.BackEnd_MyTools.Repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.BackEnd_MyTools.Entitys.UserProfile;

@Repository
public interface UserProfileRepo extends MongoRepository<UserProfile, String> {
    Optional<UserProfile> findByUserId(String userId);
}
