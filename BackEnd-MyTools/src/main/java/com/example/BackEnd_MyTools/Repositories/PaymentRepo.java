package com.example.BackEnd_MyTools.Repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.BackEnd_MyTools.Entitys.Payment;

@Repository
public interface PaymentRepo extends MongoRepository<Payment, String> {
    List<Payment> findByUserIdOrderByCreatedAtDesc(String userId);
}
