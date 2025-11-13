package com.example.BackEnd_MyTools.Repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.BackEnd_MyTools.Entitys.Product;

@Repository
public interface ProductRepo extends MongoRepository<Product, String> {
    // You can add custom query methods here if needed
}