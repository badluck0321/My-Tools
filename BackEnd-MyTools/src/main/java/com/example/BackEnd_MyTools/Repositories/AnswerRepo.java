package com.example.BackEnd_MyTools.Repositories;


import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.BackEnd_MyTools.Entitys.Answer;



public interface AnswerRepo extends MongoRepository<Answer, String> {
    List<Answer> findByQuestionIdOrderByUpvotesDesc(String questionId);
    long countByQuestionId(String questionId);
}