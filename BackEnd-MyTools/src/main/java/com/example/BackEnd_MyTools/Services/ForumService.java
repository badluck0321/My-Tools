package com.example.BackEnd_MyTools.Services;

import com.example.BackEnd_MyTools.DTO.AskQuestionRequest;
import com.example.BackEnd_MyTools.DTO.ForumQuestionDTO;
import com.example.BackEnd_MyTools.DTO.PostAnswerRequest;
import com.example.BackEnd_MyTools.Entitys.Answer;
import com.example.BackEnd_MyTools.Entitys.Question;
import com.example.BackEnd_MyTools.Kafka.KafkaProducerService;
import com.example.BackEnd_MyTools.Repositories.AnswerRepo;
import com.example.BackEnd_MyTools.Repositories.QuestionRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ForumService {

    private final QuestionRepo questionRepo;
    private final AnswerRepo answerRepo;
    private final PhotoService photoService;
    private final KafkaProducerService kafka;

    /* ── Questions ─────────────────────────────── */

    public Page<Question> getQuestions(String tag, String search,
            String sort, Pageable pageable) {
        if (pageable == null) {
            pageable = org.springframework.data.domain.PageRequest.of(0, 20,
                    org.springframework.data.domain.Sort.by("createdAt").descending());
        }
        if (tag != null && !tag.isBlank())
            return questionRepo.findByTagsContaining(tag, pageable);
        if (search != null && !search.isBlank())
            return questionRepo.findByTitleContainingIgnoreCaseOrBodyContainingIgnoreCase(
                    search, search, pageable);
        return questionRepo.findAll(pageable);
    }

    public Question getQuestion(String id) {
        Question q = questionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        q.setViewCount(q.getViewCount() + 1);
        return questionRepo.save(q);
    }

    /* ── askQuestion now receives JWT directly ── */
    public Question askQuestion(Jwt jwt,
            AskQuestionRequest req,
            List<MultipartFile> photos) throws IOException {
        String userId = jwt.getClaim("sub");
        String username = jwt.getClaim("preferred_username");

        Question q = new Question();
        q.setAuthorId(userId);
        q.setAuthorName(username);
        q.setTitle(req.getTitle());
        q.setBody(req.getBody());
        q.setTags(req.getTags() != null ? req.getTags() : List.of());
        q.setUpvotes(0);
        q.setUpvotedBy(new ArrayList<>());
        q.setViewCount(0);
        q.setSolved(false);
        q.setCreatedAt(LocalDateTime.now());
        q.setUpdatedAt(LocalDateTime.now());

        if (photos != null && !photos.isEmpty()) {
            List<String> ids = new ArrayList<>();
            for (MultipartFile f : photos)
                ids.add(photoService.savePhoto(f));
            q.setPhotoIds(ids);
        }

        Question saved = questionRepo.save(q);
        try {
            kafka.sendActivity(userId, "QUESTION_ASKED", saved.getId(), "FORUM");
        } catch (Exception ignored) {
        }
        return saved;
    }

    /* ── answerQuestion now receives JWT directly ── */
    public Answer answerQuestion(Jwt jwt,
            PostAnswerRequest req,
            List<MultipartFile> photos) throws IOException {
        String userId = jwt.getClaim("sub");
        String username = jwt.getClaim("preferred_username");

        Question q = questionRepo.findById(req.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        Answer a = new Answer();
        a.setQuestionId(req.getQuestionId());
        a.setAuthorId(userId);
        a.setAuthorName(username);
        a.setBody(req.getBody());
        a.setUpvotes(0);
        a.setUpvotedBy(new ArrayList<>());
        a.setAccepted(false);
        a.setCreatedAt(LocalDateTime.now());

        if (photos != null && !photos.isEmpty()) {
            List<String> ids = new ArrayList<>();
            for (MultipartFile f : photos)
                ids.add(photoService.savePhoto(f));
            a.setPhotoIds(ids);
        }

        Answer saved = answerRepo.save(a);
        try {
            kafka.sendNotification(q.getAuthorId(), "NEW_ANSWER",
                    "New answer on your question",
                    username + " answered: " + q.getTitle(),
                    req.getQuestionId());
        } catch (Exception ignored) {
        }
        return saved;
    }

    /* ── Vote toggle (question) ── */
    public Question voteQuestion(String questionId, String userId, boolean upvote) {
        Question q = questionRepo.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        if (q.getAuthorId().equals(userId))
            throw new RuntimeException("Cannot vote your own question");
        if (q.getUpvotedBy() == null)
            q.setUpvotedBy(new ArrayList<>());

        if (upvote) {
            if (!q.getUpvotedBy().contains(userId)) {
                q.getUpvotedBy().add(userId);
                q.setUpvotes(q.getUpvotes() + 1);
            } else {
                // toggle off
                q.getUpvotedBy().remove(userId);
                q.setUpvotes(q.getUpvotes() - 1);
            }
        }
        return questionRepo.save(q);
    }

    /* ── Vote toggle (answer) ── */
    public Answer voteAnswer(String answerId, String userId, boolean upvote) {
        Answer a = answerRepo.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
        if (a.getAuthorId().equals(userId))
            throw new RuntimeException("Cannot vote your own answer");
        if (a.getUpvotedBy() == null)
            a.setUpvotedBy(new ArrayList<>());

        if (upvote) {
            if (!a.getUpvotedBy().contains(userId)) {
                a.getUpvotedBy().add(userId);
                a.setUpvotes(a.getUpvotes() + 1);
            } else {
                a.getUpvotedBy().remove(userId);
                a.setUpvotes(a.getUpvotes() - 1);
            }
        }
        return answerRepo.save(a);
    }

    /* ── Accept answer ── */
    public Answer acceptAnswer(String answerId, String userId) {
        Answer a = answerRepo.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
        Question q = questionRepo.findById(a.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!q.getAuthorId().equals(userId))
            throw new RuntimeException("Only the question author can accept");

        // unaccept previous
        if (q.getAcceptedAnswerId() != null) {
            answerRepo.findById(q.getAcceptedAnswerId()).ifPresent(prev -> {
                prev.setAccepted(false);
                answerRepo.save(prev);
            });
        }

        a.setAccepted(true);
        answerRepo.save(a);
        q.setSolved(true);
        q.setAcceptedAnswerId(answerId);
        questionRepo.save(q);

        try {
            kafka.sendNotification(a.getAuthorId(), "ANSWER_ACCEPTED",
                    "Your answer was accepted!",
                    "Your answer to \"" + q.getTitle() + "\" was marked as best.",
                    q.getId());
        } catch (Exception ignored) {
        }
        return a;
    }

    /* ── Delete ── */
    public void deleteQuestion(String questionId, String userId) {
        Question q = questionRepo.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Not found"));
        if (!q.getAuthorId().equals(userId))
            throw new RuntimeException("Not your question");
        answerRepo.findByQuestionIdOrderByUpvotesDesc(questionId)
                .forEach(answerRepo::delete);
        questionRepo.delete(q);
    }

    public void deleteAnswer(String answerId, String userId) {
        Answer a = answerRepo.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Not found"));
        if (!a.getAuthorId().equals(userId))
            throw new RuntimeException("Not your answer");
        answerRepo.delete(a);
    }

    public List<Answer> getAnswers(String questionId) {
        return answerRepo.findByQuestionIdOrderByUpvotesDesc(questionId);
    }

    /* ── Forum feed ── */
    public List<ForumQuestionDTO> getForumFeed() {
        return questionRepo.findAll().stream()
                .map(q -> new ForumQuestionDTO(
                        q,
                        answerRepo.findByQuestionIdOrderByUpvotesDesc(q.getId()),
                        (int) answerRepo.countByQuestionId(q.getId())))
                .sorted((a, b) -> b.getQuestion().getCreatedAt()
                        .compareTo(a.getQuestion().getCreatedAt()))
                .toList();
    }
}