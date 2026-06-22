package com.example.BackEnd_MyTools.Entitys;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

// Question.java
@Document(collection = "Question")
@Data
public class Question {

    @Id
    private String id;

    private String authorId;        // Keycloak sub
    private String authorName;      // snapshot
    private String title;
    private String body;            // detailed description
    private List<String> tags;      // ["plumbing", "drill", "leak"]
    private List<String> photoIds;  // GridFS ObjectIds
    private int upvotes;
    private List<String> upvotedBy; // userIds who upvoted
    private int viewCount;
    private boolean solved;         // true when an answer is accepted
    private String acceptedAnswerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}