package com.example.BackEnd_MyTools.DTO;

import lombok.Data;


@Data
public class PostAnswerRequest {
    private String questionId;
    private String body;
}