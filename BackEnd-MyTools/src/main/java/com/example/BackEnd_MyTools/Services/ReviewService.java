package com.example.BackEnd_MyTools.Services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.DTO.AddReviewRequest;
import com.example.BackEnd_MyTools.Entitys.Cart;
import com.example.BackEnd_MyTools.Entitys.Review;
import com.example.BackEnd_MyTools.Repositories.CartRepo;
import com.example.BackEnd_MyTools.Repositories.ReviewRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepo reviewRepository;
    private final CartRepo cartRepository;

    public List<Review> getProductReviews(String productId) {
        return reviewRepository.findByProductId(productId);
    }

    public List<Review> getMasteryReviews(String masteryId) {
        return reviewRepository.findByMasteryId(masteryId);
    }

    public Review addReview(String userId, String username, AddReviewRequest req) {

        // one review per user per product
        if (reviewRepository.existsByUserIdAndProductId(userId, req.getProductId())) {
            throw new RuntimeException("You have already reviewed this product");
        }

        // validate rating range
        if (req.getRating() < 1 || req.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        // check verified purchase
        boolean verified = cartRepository
            .findByUserIdAndStatus(userId, Cart.CartStatus.CHECKED_OUT)
            .map(cart -> cart.getItems().stream()
                .anyMatch(i -> i.getProductId().equals(req.getProductId())))
                .orElse(false);
            
        Review review = new Review();
        review.setProductId(req.getProductId());
        review.setUserId(userId);
        review.setUsername(username);     // snapshot from JWT preferred_username
        review.setRating(req.getRating());
        review.setComment(req.getComment());
        review.setVerifiedPurchase(verified);
        review.setCreatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    public void deleteReview(String reviewId, String userId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Review not found"));
        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("You can only delete your own reviews");
        }
        reviewRepository.delete(review);
    }

    public double getAverageRating(String productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        return reviews.stream()
            .mapToInt(Review::getRating)
            .average()
            .orElse(0.0);
    }
}