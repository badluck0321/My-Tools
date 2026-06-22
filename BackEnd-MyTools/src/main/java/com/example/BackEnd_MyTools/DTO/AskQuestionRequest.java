package com.example.BackEnd_MyTools.DTO;

import java.util.List;

import lombok.Data;

@Data
public class AskQuestionRequest {
    private String title;
    private String body;
    private List<String> tags;
}

