package com.example.BackEnd_MyTools.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.BackEnd_MyTools.Entitys.RoleRequest;

@Repository
public interface RoleRequestRepo extends MongoRepository<RoleRequest, String> {
    List<RoleRequest> findByUserIdOrderByCreatedAtDesc(String userId);

    List<RoleRequest> findByStatusOrderByCreatedAtDesc(RoleRequest.RoleRequestStatus status);

    Optional<RoleRequest> findTopByUserIdAndStatusOrderByCreatedAtDesc(String userId,
            RoleRequest.RoleRequestStatus status);

    Optional<RoleRequest> findTopByUserIdOrderByCreatedAtDesc(String userId);
}
