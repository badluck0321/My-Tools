package com.example.BackEnd_MyTools.Repositories;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.BackEnd_MyTools.Entitys.Demande;

@Repository
public interface DemandeRepo  extends MongoRepository<Demande, Integer> {
    // You can add custom query methods here if needed
    
}
