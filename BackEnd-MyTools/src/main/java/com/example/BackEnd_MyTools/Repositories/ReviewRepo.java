package com.example.BackEnd_MyTools.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.BackEnd_MyTools.Entitys.Review;

public interface ReviewRepo extends MongoRepository<Review, String> {
    List<Review> findByProductId(String productId);
    List<Review> findByMasteryId(String masteryId);
    boolean existsByUserIdAndProductId(String userId, String productId);
    Optional<Review> findByUserIdAndProductId(String userId, String productId);
    // for average rating
    List<Review> findByProductIdIn(List<String> productIds);
}
