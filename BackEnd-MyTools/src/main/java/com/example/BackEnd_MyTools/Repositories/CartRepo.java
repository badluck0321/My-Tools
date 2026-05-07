package com.example.BackEnd_MyTools.Repositories;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.BackEnd_MyTools.Entitys.Cart;

public interface CartRepo extends MongoRepository<Cart, String> {
    Optional<Cart> findByUserIdAndStatus(String userId, Cart.CartStatus status);
    List<Cart> findByStatusAndExpiresAtBefore(Cart.CartStatus status, LocalDateTime dateTime);

}