package com.example.BackEnd_MyTools.Repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.BackEnd_MyTools.Entitys.Store;

@Repository
public interface StoreRepo extends MongoRepository<Store, String> {
Optional<Store> findByOwnerIdContaining(String ownerId);
boolean existsByOwnerIdContaining(String ownerId);
boolean existsByAssociatsIdsContaining(String userId);

}
