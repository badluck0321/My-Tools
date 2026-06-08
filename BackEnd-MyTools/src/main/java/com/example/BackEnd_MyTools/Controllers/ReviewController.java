package com.example.BackEnd_MyTools.Controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.BackEnd_MyTools.DTO.AddReviewRequest;
import com.example.BackEnd_MyTools.Entitys.Review;
import com.example.BackEnd_MyTools.Services.ReviewService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
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
        public ResponseEntity<List<Review>> getMasteryReviews(@PathVariable String masteryId) {
        return ResponseEntity.ok(reviewService.getMasteryReviews(masteryId));
    }


    @PostMapping
    public ResponseEntity<Review> addProductReview(
            @RequestBody AddReviewRequest req,
            @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getClaim("sub");
        String username = jwt.getClaim("preferred_username");
        return ResponseEntity.ok(reviewService.addReview(userId, username, req));
    }
        @PostMapping
    public ResponseEntity<Review> addMaster3Review(
            @RequestBody AddReviewRequest req,
            @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getClaim("sub");
        String username = jwt.getClaim("preferred_username");
        return ResponseEntity.ok(reviewService.addReview(userId, username, req));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable String reviewId,
            @AuthenticationPrincipal Jwt jwt) {
        reviewService.deleteReview(reviewId, jwt.getClaim("sub"));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/product/{productId}/average")
    public ResponseEntity<?> getAverage(@PathVariable String productId) {
        return ResponseEntity.ok(
            Map.of("average", reviewService.getAverageRating(productId),
                   "count",   reviewService.getProductReviews(productId).size())
        );
    }
}