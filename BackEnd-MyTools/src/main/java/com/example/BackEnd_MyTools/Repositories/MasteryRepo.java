package com.example.BackEnd_MyTools.Repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.BackEnd_MyTools.Entitys.Mastery;

@Repository
public interface MasteryRepo extends MongoRepository<Mastery, String> {

}
