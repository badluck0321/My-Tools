package com.example.BackEnd_MyTools.Entitys;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
// Answer.java
@Document(collection = "Answer")
@Data
public class Answer {

    @Id
    private String id;

    private String questionId;
    private String authorId;
    private String authorName;
    private String body;
    private List<String> photoIds;  // GridFS ObjectIds
    private int upvotes;
    private List<String> upvotedBy;
    private boolean accepted;       // marked by question author
    private LocalDateTime createdAt;
}