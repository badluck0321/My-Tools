package com.example.BackEnd_MyTools.Services;

import com.example.BackEnd_MyTools.DTO.AddReviewRequest;
import com.example.BackEnd_MyTools.Entitys.Review;
import com.example.BackEnd_MyTools.Repositories.OrderRepo;
import com.example.BackEnd_MyTools.Repositories.ReviewRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.List;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {
    @Mock
    ReviewRepo reviewRepository;
    @Mock
    OrderRepo orderRepository;
    @InjectMocks
    ReviewService reviewService;

    @Test
    void addReviewRejectsRatingOutsideRange() {
        AddReviewRequest r = new AddReviewRequest();
        r.setProductId("P001");
        r.setRating(6);
        assertThatThrownBy(() -> reviewService.addReview("U001", "user", r))
                .isInstanceOf(IllegalArgumentException.class).hasMessageContaining("between 1 and 5");
    }

    @Test
    void addReviewRequiresExactlyOneTarget() {
        AddReviewRequest r = new AddReviewRequest();
        r.setProductId("P001");
        r.setMasteryId("M001");
        r.setRating(4);
        assertThatThrownBy(() -> reviewService.addReview("U001", "user", r))
                .isInstanceOf(IllegalArgumentException.class).hasMessageContaining("exactly one target");
    }

    @Test
    void averageRatingCalculatesMean() {
        Review a = new Review();
        a.setRating(5);
        Review b = new Review();
        b.setRating(3);
        when(reviewRepository.findByProductId("P001")).thenReturn(List.of(a, b));
        assertThat(reviewService.getAverageRating("P001")).isEqualTo(4.0);
    }
}
