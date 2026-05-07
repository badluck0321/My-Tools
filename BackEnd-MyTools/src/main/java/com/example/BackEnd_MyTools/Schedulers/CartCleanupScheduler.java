package com.example.BackEnd_MyTools.Schedulers;
import com.example.BackEnd_MyTools.Entitys.Cart;
import com.example.BackEnd_MyTools.Repositories.CartRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CartCleanupScheduler {

    private final CartRepo cartRepository;

    @Scheduled(cron = "0 0 2 * * *") // runs every day at 2am
    public void abandonStaleCarts() {
        List<Cart> expired = cartRepository
            .findByStatusAndExpiresAtBefore(Cart.CartStatus.ACTIVE, LocalDateTime.now());

        expired.forEach(c -> c.setStatus(Cart.CartStatus.ABANDONED));
        cartRepository.saveAll(expired);
    }
}