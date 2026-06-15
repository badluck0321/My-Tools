package com.example.BackEnd_MyTools.Services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.DTO.AddReviewRequest;
import com.example.BackEnd_MyTools.Entitys.Order;
import com.example.BackEnd_MyTools.Entitys.Review;
import com.example.BackEnd_MyTools.Repositories.OrderRepo;
import com.example.BackEnd_MyTools.Repositories.ReviewRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepo reviewRepository;
    private final OrderRepo orderRepository;

    public List<Review> getProductReviews(String productId) { return reviewRepository.findByProductId(productId); }
    public List<Review> getMasteryReviews(String masteryId) { return reviewRepository.findByMasteryId(masteryId); }

    public Review addReview(String userId, String username, AddReviewRequest req) {
        validateRequest(userId, req);
        boolean verified = false;
        if (req.getProductId() != null) {
            verified = orderRepository.findByBuyerIdAndStatusIn(userId, List.of(Order.OrderStatus.CONFIRMED, Order.OrderStatus.SHIPPED, Order.OrderStatus.DELIVERED))
                .stream().flatMap(o -> o.getItems().stream())
                .anyMatch(i -> i.getProductId().equals(req.getProductId()));
        }
        Review review = new Review();
        review.setProductId(req.getProductId());
        review.setMasteryId(req.getMasteryId());
        review.setUserId(userId);
        review.setUsername(username);
        review.setRating(req.getRating());
        review.setComment(req.getComment());
        review.setVerifiedPurchase(verified);
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    public void deleteReview(String reviewId, String userId) {
        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new IllegalArgumentException("Review not found"));
        if (!review.getUserId().equals(userId)) throw new SecurityException("You can only delete your own reviews");
        reviewRepository.delete(review);
    }

    public double getAverageRating(String productId) {
        return average(reviewRepository.findByProductId(productId));
    }

    public double getMasteryAverageRating(String masteryId) {
        return average(reviewRepository.findByMasteryId(masteryId));
    }

    private void validateRequest(String userId, AddReviewRequest req) {
        if (req.getRating() < 1 || req.getRating() > 5) throw new IllegalArgumentException("Rating must be between 1 and 5");
        boolean product = req.getProductId() != null && !req.getProductId().isBlank();
        boolean mastery = req.getMasteryId() != null && !req.getMasteryId().isBlank();
        if (product == mastery) throw new IllegalArgumentException("Provide exactly one target: productId or masteryId");
        if (product && reviewRepository.existsByUserIdAndProductId(userId, req.getProductId())) throw new IllegalArgumentException("You have already reviewed this product");
        if (mastery && reviewRepository.existsByUserIdAndMasteryId(userId, req.getMasteryId())) throw new IllegalArgumentException("You have already reviewed this service");
    }

    private double average(List<Review> reviews) {
        return reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
    }
}
