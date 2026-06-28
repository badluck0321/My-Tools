package com.example.BackEnd_MyTools.Controllers;

import com.example.BackEnd_MyTools.DTO.AskQuestionRequest;
import com.example.BackEnd_MyTools.DTO.ForumQuestionDTO;
import com.example.BackEnd_MyTools.DTO.PostAnswerRequest;
import com.example.BackEnd_MyTools.Entitys.Answer;
import com.example.BackEnd_MyTools.Entitys.Question;
import com.example.BackEnd_MyTools.Services.ForumService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/forum")
@RequiredArgsConstructor
public class ForumController {

    private final ForumService forumService;
    private final ObjectMapper objectMapper;

    /* ── GET /forum/questions ── */
    @GetMapping("/questions")
    public ResponseEntity<Page<Question>> getQuestions(
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Sort s = "top".equals(sort)
                ? Sort.by("upvotes").descending()
                : Sort.by("createdAt").descending();

        return ResponseEntity.ok(
                forumService.getQuestions(tag, search, sort,
                        PageRequest.of(page, size, s)));
    }

    /* ── GET /forum/questions/:id ── public ── */
    @GetMapping("/questions/{id}")
    public ResponseEntity<Question> getQuestion(@PathVariable String id) {
        return ResponseEntity.ok(forumService.getQuestion(id));
    }

    /* ── GET /forum/questions/:id/answers ── public ── */
    @GetMapping("/questions/{id}/answers")
    public ResponseEntity<List<Answer>> getAnswers(@PathVariable String id) {
        return ResponseEntity.ok(forumService.getAnswers(id));
    }

    /* ── POST /forum/questions ── auth required ── */
    @PostMapping(value = "/questions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Question> askQuestion(
            @RequestPart("question") String questionJson,
            @RequestPart(value = "photos", required = false) List<MultipartFile> photos,
            @AuthenticationPrincipal Jwt jwt) throws Exception {

        AskQuestionRequest req = objectMapper.readValue(questionJson, AskQuestionRequest.class);
        return ResponseEntity.ok(forumService.askQuestion(jwt, req, photos));
    }

    /* ── POST /forum/questions/:id/answers ── auth required ── */
    @PostMapping(value = "/questions/{id}/answers", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Answer> postAnswer(
            @PathVariable String id,
            @RequestPart("answer") String answerJson,
            @RequestPart(value = "photos", required = false) List<MultipartFile> photos,
            @AuthenticationPrincipal Jwt jwt) throws Exception {

        PostAnswerRequest req = objectMapper.readValue(answerJson, PostAnswerRequest.class);
        req.setQuestionId(id);
        return ResponseEntity.ok(forumService.answerQuestion(jwt, req, photos));
    }

    /* ── PUT /forum/questions/:id/vote?type=up ── auth required ── */
    @PutMapping("/questions/{id}/vote")
    public ResponseEntity<Question> voteQuestion(
            @PathVariable String id,
            @RequestParam String type,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(
                forumService.voteQuestion(id, jwt.getClaim("sub"),
                        "up".equalsIgnoreCase(type)));
    }

    /* ── PUT /forum/answers/:id/vote?type=up ── auth required ── */
    @PutMapping("/answers/{id}/vote")
    public ResponseEntity<Answer> voteAnswer(
            @PathVariable String id,
            @RequestParam String type,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(
                forumService.voteAnswer(id, jwt.getClaim("sub"),
                        "up".equalsIgnoreCase(type)));
    }

    /* ── PUT /forum/answers/:id/accept ── question author only ── */
    @PutMapping("/answers/{id}/accept")
    public ResponseEntity<Answer> acceptAnswer(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(
                forumService.acceptAnswer(id, jwt.getClaim("sub")));
    }

    /* ── DELETE /forum/questions/:id ── */
    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        forumService.deleteQuestion(id, jwt.getClaim("sub"));
        return ResponseEntity.noContent().build();
    }

    /* ── DELETE /forum/answers/:id ── */
    @DeleteMapping("/answers/{id}")
    public ResponseEntity<Void> deleteAnswer(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        forumService.deleteAnswer(id, jwt.getClaim("sub"));
        return ResponseEntity.noContent().build();
    }

    /* ── GET /forum/feed ── full DTO with answers ── */
    @GetMapping("/feed")
    public ResponseEntity<List<ForumQuestionDTO>> getFeed() {
        return ResponseEntity.ok(forumService.getForumFeed());
    }
}