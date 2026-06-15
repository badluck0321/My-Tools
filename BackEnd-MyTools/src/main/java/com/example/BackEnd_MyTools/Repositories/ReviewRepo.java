package com.example.BackEnd_MyTools.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.BackEnd_MyTools.Entitys.Review;

public interface ReviewRepo extends MongoRepository<Review, String> {
    List<Review> findByProductId(String productId);
    List<Review> findByMasteryId(String masteryId);
    boolean existsByUserIdAndProductId(String userId, String productId);
    boolean existsByUserIdAndMasteryId(String userId, String masteryId);
    Optional<Review> findByUserIdAndProductId(String userId, String productId);
    Optional<Review> findByUserIdAndMasteryId(String userId, String masteryId);
    List<Review> findByProductIdIn(List<String> productIds);
}
