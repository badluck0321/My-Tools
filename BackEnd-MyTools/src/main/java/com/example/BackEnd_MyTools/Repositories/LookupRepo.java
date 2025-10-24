package com.example.BackEnd_MyTools.Repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.ReadPreference;

import com.example.BackEnd_MyTools.Entitys.Lookups;


@ReadPreference
public interface LookupRepo extends MongoRepository<Lookups, Integer> {

    
    
}
