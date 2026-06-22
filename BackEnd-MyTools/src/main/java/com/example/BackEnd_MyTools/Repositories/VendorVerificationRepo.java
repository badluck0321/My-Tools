package com.example.BackEnd_MyTools.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.BackEnd_MyTools.Entitys.VendorVerification;

@Repository
public interface VendorVerificationRepo extends MongoRepository<VendorVerification, String> {
    Optional<VendorVerification> findTopByUserIdOrderByCreatedAtDesc(String userId);
    List<VendorVerification> findByStatusOrderByCreatedAtDesc(VendorVerification.VerificationStatus status);
}
