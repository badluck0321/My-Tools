package com.example.BackEnd_MyTools.Repositories;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.BackEnd_MyTools.Entitys.Lookups;

public interface LookupRepository extends MongoRepository<Lookups, String> {
    // Optional<Lookups> findById(String id); 

    List<Lookups> findByTypeAndIsActiveTrue(String type);

    Optional<Lookups> findByTypeAndCode(String type, String code);

    boolean existsByTypeAndCode(String type, String code);
}