package com.example.BackEnd_MyTools.Controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.example.BackEnd_MyTools.DTO.AddReviewRequest;
import com.example.BackEnd_MyTools.Entitys.Review;
import com.example.BackEnd_MyTools.Security.SecurityUtils;
import com.example.BackEnd_MyTools.Services.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable String productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    @GetMapping("/mastery/{masteryId}")
    public ResponseEntity<List<Review>> getMasteryReviews(@PathVariable String masteryId) {
        return ResponseEntity.ok(reviewService.getMasteryReviews(masteryId));
    }

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody AddReviewRequest req, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(reviewService.addReview(SecurityUtils.currentUserId(jwt), SecurityUtils.currentUsername(jwt), req));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable String reviewId, @AuthenticationPrincipal Jwt jwt) {
        reviewService.deleteReview(reviewId, SecurityUtils.currentUserId(jwt));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/product/{productId}/average")
    public ResponseEntity<?> getProductAverage(@PathVariable String productId) {
        return ResponseEntity.ok(Map.of("average", reviewService.getAverageRating(productId), "count", reviewService.getProductReviews(productId).size()));
    }

    @GetMapping("/mastery/{masteryId}/average")
    public ResponseEntity<?> getMasteryAverage(@PathVariable String masteryId) {
        return ResponseEntity.ok(Map.of("average", reviewService.getMasteryAverageRating(masteryId), "count", reviewService.getMasteryReviews(masteryId).size()));
    }
}
