package com.example.BackEnd_MyTools.DTO;

import java.util.List;
import com.example.BackEnd_MyTools.Entitys.Answer;
import com.example.BackEnd_MyTools.Entitys.Question;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ForumQuestionDTO {

    private Question question;

    private List<Answer> answers;

    private int answerCount;
}