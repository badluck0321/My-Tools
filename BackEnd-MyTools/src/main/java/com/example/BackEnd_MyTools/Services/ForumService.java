package com.example.BackEnd_MyTools.Services;


// ── ADD these missing imports ──────────────────────────
import com.example.BackEnd_MyTools.Entitys.Question;
import com.example.BackEnd_MyTools.Kafka.KafkaProducerService;
import com.example.BackEnd_MyTools.Entitys.Answer;
import com.example.BackEnd_MyTools.DTO.AskQuestionRequest;
import com.example.BackEnd_MyTools.DTO.PostAnswerRequest;
import com.example.BackEnd_MyTools.Repositories.AnswerRepo;
import com.example.BackEnd_MyTools.Repositories.QuestionRepo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ForumService {

    private final QuestionRepo questionRepo;
    private final AnswerRepo answerRepo;
    private final PhotoService photoService;
    private final KafkaProducerService kafka;

    /* ── Questions ─────────────────────────────────── */

    public Page<Question> getQuestions(String tag, String search,
                                        String sort, Pageable pageable) {
        if (tag != null && !tag.isBlank()) {
            return questionRepo.findByTagsContaining(tag, pageable);
        }
        if (search != null && !search.isBlank()) {
            return questionRepo
                .findByTitleContainingIgnoreCaseOrBodyContainingIgnoreCase(
                    search, search, pageable);
        }
        return questionRepo.findAll(pageable);
    }

    public Question getQuestion(String id) {
        Question q = questionRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Question not found"));
        // increment view count
        q.setViewCount(q.getViewCount() + 1);
        return questionRepo.save(q);
    }

    public Question askQuestion(String userId, String username,
                                 AskQuestionRequest req,
                                 List<MultipartFile> photos) throws IOException {
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
            for (MultipartFile f : photos) ids.add(photoService.savePhoto(f));
            q.setPhotoIds(ids);
        }

        Question saved = questionRepo.save(q);
        kafka.sendActivity(userId, "QUESTION_ASKED", saved.getId(), "FORUM");
        return saved;
    }

    public Question upvoteQuestion(String questionId, String userId) {
        Question q = questionRepo.findById(questionId)
            .orElseThrow(() -> new RuntimeException("Question not found"));

        if (q.getAuthorId().equals(userId))
            throw new RuntimeException("You cannot upvote your own question");

        if (q.getUpvotedBy().contains(userId)) {
            // toggle off
            q.getUpvotedBy().remove(userId);
            q.setUpvotes(q.getUpvotes() - 1);
        } else {
            q.getUpvotedBy().add(userId);
            q.setUpvotes(q.getUpvotes() + 1);
        }
        return questionRepo.save(q);
    }

    public void deleteQuestion(String questionId, String userId) {
        Question q = questionRepo.findById(questionId)
            .orElseThrow(() -> new RuntimeException("Not found"));
        if (!q.getAuthorId().equals(userId))
            throw new RuntimeException("You can only delete your own questions");
        answerRepo.findByQuestionIdOrderByUpvotesDesc(questionId)
            .forEach(answerRepo::delete);
        questionRepo.delete(q);
    }

    /* ── Answers ───────────────────────────────────── */

    public Answer postAnswer(String userId, String username,
                              PostAnswerRequest req,
                              List<MultipartFile> photos) throws IOException {
        // question must exist
        questionRepo.findById(req.getQuestionId())
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
            for (MultipartFile f : photos) ids.add(photoService.savePhoto(f));
            a.setPhotoIds(ids);
        }

        Answer saved = answerRepo.save(a);

        // notify question author
        Question q = questionRepo.findById(req.getQuestionId()).get();
        kafka.sendNotification(q.getAuthorId(), "NEW_ANSWER",
            "New answer on your question", a.getAuthorName() + " answered: " + q.getTitle(),
            req.getQuestionId());

        return saved;
    }

    public Answer upvoteAnswer(String answerId, String userId) {
        Answer a = answerRepo.findById(answerId)
            .orElseThrow(() -> new RuntimeException("Answer not found"));

        if (a.getAuthorId().equals(userId))
            throw new RuntimeException("You cannot upvote your own answer");

        if (a.getUpvotedBy().contains(userId)) {
            a.getUpvotedBy().remove(userId);
            a.setUpvotes(a.getUpvotes() - 1);
        } else {
            a.getUpvotedBy().add(userId);
            a.setUpvotes(a.getUpvotes() + 1);
        }
        return answerRepo.save(a);
    }

    public void acceptAnswer(String answerId, String userId) {
        Answer a = answerRepo.findById(answerId)
            .orElseThrow(() -> new RuntimeException("Answer not found"));
        Question q = questionRepo.findById(a.getQuestionId())
            .orElseThrow(() -> new RuntimeException("Question not found"));

        // only question author can accept
        if (!q.getAuthorId().equals(userId))
            throw new RuntimeException("Only the question author can accept an answer");

        // unaccept previous if any
        if (q.getAcceptedAnswerId() != null) {
            answerRepo.findById(q.getAcceptedAnswerId())
                .ifPresent(prev -> { prev.setAccepted(false); answerRepo.save(prev); });
        }

        a.setAccepted(true);
        answerRepo.save(a);

        q.setSolved(true);
        q.setAcceptedAnswerId(answerId);
        questionRepo.save(q);

        kafka.sendNotification(a.getAuthorId(), "ANSWER_ACCEPTED",
            "Your answer was accepted!", "Your answer to \"" + q.getTitle() + "\" was marked as the best answer.",
            q.getId());
    }

    public void deleteAnswer(String answerId, String userId) {
        Answer a = answerRepo.findById(answerId)
            .orElseThrow(() -> new RuntimeException("Not found"));
        if (!a.getAuthorId().equals(userId))
            throw new RuntimeException("You can only delete your own answers");
        answerRepo.delete(a);
    }

    public List<Answer> getAnswers(String questionId) {
        return answerRepo.findByQuestionIdOrderByUpvotesDesc(questionId);
    }
}