package com.example.BackEnd_MyTools.Repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.BackEnd_MyTools.Entitys.Mastery;

@Repository
public interface MasteryRepo extends MongoRepository<Mastery, String> {
    List<Mastery> findByMasterIdOrderByIdDesc(String masterId);

    int countByMasterId(String masterId);
}
