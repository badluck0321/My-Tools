package com.example.BackEnd_MyTools.Repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.BackEnd_MyTools.Entitys.Product;

@Repository
public interface ProductRepo extends MongoRepository<Product, String> {
    List<Product> findByOwnerIdOrderByCreatedAtDesc(String ownerId);

    @Query("{ 'categoryId': ?0, '_id': { $ne: ?1 }, 'isavailable': true, 'hidden': { $ne: true } }")
    List<Product> findRecommended(int categoryId, String excludedProductId);
}
