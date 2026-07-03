package com.example.BackEnd_MyTools.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.BackEnd_MyTools.Entitys.Favorite;

public interface FavoriteRepo extends MongoRepository<Favorite, String> {
    List<Favorite> findByUserId(String userId);

    Optional<Favorite> findByUserIdAndTargetTypeAndTargetId(String userId, String targetType, String targetId);
    boolean existsByUserIdAndTargetTypeAndTargetId(String userId, String targetType, String targetId);
    void deleteByUserIdAndTargetTypeAndTargetId(String userId, String targetType, String targetId);

    // Legacy product helpers kept for backward compatibility with existing code and data.
    Optional<Favorite> findByUserIdAndProductId(String userId, String productId);
    boolean existsByUserIdAndProductId(String userId, String productId);
    void deleteByUserIdAndProductId(String userId, String productId);
}
