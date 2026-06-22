package com.example.BackEnd_MyTools.Repositories;


import java.util.List;
import com.example.BackEnd_MyTools.Entitys.Question;

import org.springdoc.core.converters.models.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface QuestionRepo extends MongoRepository<Question, String> {
    Page<Question> findByTagsContaining(String tag, org.springframework.data.domain.Pageable pageable);
    Page<Question> findByTitleContainingIgnoreCaseOrBodyContainingIgnoreCase(
        String title, String body, org.springframework.data.domain.Pageable pageable);
    Page<Question> findByAuthorId(String authorId, Pageable pageable);
    List<Question> findTop10ByOrderByCreatedAtDesc();
    List<Question> findTop10ByOrderByUpvotesDesc();
}

