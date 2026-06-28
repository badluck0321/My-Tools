package com.example.BackEnd_MyTools.Services;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import com.example.BackEnd_MyTools.Kafka.KafkaProducerService;
import org.springframework.stereotype.Service;
import com.example.BackEnd_MyTools.Entitys.Favorite;
import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Repositories.FavoriteRepo;
import com.example.BackEnd_MyTools.Repositories.ProductRepo;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepo favoriteRepository;
    private final ProductRepo productRepository;
private final KafkaProducerService kafka;


    public List<Favorite> getFavorites(String userId) {
        return favoriteRepository.findByUserId(userId);
    }

    public boolean isFavorited(String userId, String productId) {
        return favoriteRepository.existsByUserIdAndProductId(userId, productId);
    }

    // returns true if added, false if removed
    public boolean toggle(String userId, String productId) {
        Optional<Favorite> existing =
            favoriteRepository.findByUserIdAndProductId(userId, productId);

    if (existing.isPresent()) {
        favoriteRepository.delete(existing.get());
        try { kafka.sendActivity(userId, "UNFAVORITED", productId, "PRODUCT"); } catch (Exception ignored) {}
        return false;
    }

        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        Favorite favorite = new Favorite();
        favorite.setUserId(userId);
        favorite.setProductId(productId);
        favorite.setProductName(product.getName());   // snapshot
        favorite.setPrice(product.getPrice());
        favorite.setSavedAt(LocalDateTime.now());
        favoriteRepository.save(favorite);

            // Non-critical Kafka notifications must not break the user action.
    try {
        kafka.sendActivity(userId, "FAVORITED", productId, "PRODUCT");
        if (product.getOwnerId() != null && !product.getOwnerId().equals(userId)) {
            kafka.sendNotification(product.getOwnerId(), "PRODUCT_FAVORITED", "Someone liked your product!", product.getName() + " was added to a wishlist", productId);
        }
    } catch (Exception ignored) {}
        return true;
    }

    public void deleteByUserIdAndProductId(String userId, String productId) {
        favoriteRepository.deleteByUserIdAndProductId(userId, productId);
    }
}