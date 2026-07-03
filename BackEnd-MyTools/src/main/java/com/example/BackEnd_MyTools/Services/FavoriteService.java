package com.example.BackEnd_MyTools.Services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.Entitys.Favorite;
import com.example.BackEnd_MyTools.Entitys.Mastery;
import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Kafka.KafkaProducerService;
import com.example.BackEnd_MyTools.Repositories.FavoriteRepo;
import com.example.BackEnd_MyTools.Repositories.MasteryRepo;
import com.example.BackEnd_MyTools.Repositories.ProductRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    public static final String PRODUCT = "PRODUCT";
    public static final String MASTERY = "MASTERY";

    private final FavoriteRepo favoriteRepository;
    private final ProductRepo productRepository;
    private final MasteryRepo masteryRepository;
    private final KafkaProducerService kafka;

    public List<Favorite> getFavorites(String userId) {
        return favoriteRepository.findByUserId(userId).stream()
                .map(this::normalizeFavorite)
                .toList();
    }

    public boolean isFavorited(String userId, String productId) {
        return isFavorited(userId, PRODUCT, productId);
    }

    public boolean isFavorited(String userId, String targetType, String targetId) {
        String type = normalizeType(targetType);
        if (PRODUCT.equals(type)) {
            return favoriteRepository.existsByUserIdAndTargetTypeAndTargetId(userId, PRODUCT, targetId)
                    || favoriteRepository.existsByUserIdAndProductId(userId, targetId);
        }
        return favoriteRepository.existsByUserIdAndTargetTypeAndTargetId(userId, type, targetId);
    }

    // Legacy product toggle kept for older frontend calls.
    public boolean toggle(String userId, String productId) {
        return toggle(userId, PRODUCT, productId);
    }

    // returns true if added, false if removed
    public boolean toggle(String userId, String targetType, String targetId) {
        String type = normalizeType(targetType);
        Optional<Favorite> existing = findExisting(userId, type, targetId);

        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            sendActivity(userId, "UNFAVORITED", targetId, type);
            return false;
        }

        Favorite favorite = PRODUCT.equals(type)
                ? buildProductFavorite(userId, targetId)
                : buildMasteryFavorite(userId, targetId);

        favoriteRepository.save(favorite);
        sendFavoriteEvents(userId, type, targetId, favorite.getItemName());
        return true;
    }

    public void deleteByUserIdAndProductId(String userId, String productId) {
        deleteByUserIdAndTarget(userId, PRODUCT, productId);
    }

    public void deleteByUserIdAndTarget(String userId, String targetType, String targetId) {
        findExisting(userId, normalizeType(targetType), targetId).ifPresent(favoriteRepository::delete);
    }

    private Optional<Favorite> findExisting(String userId, String type, String targetId) {
        Optional<Favorite> existing = favoriteRepository.findByUserIdAndTargetTypeAndTargetId(userId, type, targetId);
        if (existing.isPresent()) {
            return existing;
        }
        if (PRODUCT.equals(type)) {
            return favoriteRepository.findByUserIdAndProductId(userId, targetId);
        }
        return Optional.empty();
    }

    private Favorite buildProductFavorite(String userId, String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        Favorite favorite = new Favorite();
        favorite.setUserId(userId);
        favorite.setTargetType(PRODUCT);
        favorite.setTargetId(productId);
        favorite.setProductId(productId);
        favorite.setProductName(product.getName());
        favorite.setItemName(product.getName());
        favorite.setPrice(product.getPrice());
        favorite.setPhotoUrl(firstPhoto(product.getPhotoUrls()));
        favorite.setSavedAt(LocalDateTime.now());
        return favorite;
    }

    private Favorite buildMasteryFavorite(String userId, String masteryId) {
        Mastery mastery = masteryRepository.findById(masteryId)
                .orElseThrow(() -> new IllegalArgumentException("Mastery not found"));

        Favorite favorite = new Favorite();
        favorite.setUserId(userId);
        favorite.setTargetType(MASTERY);
        favorite.setTargetId(masteryId);
        favorite.setMasteryId(masteryId);
        favorite.setItemName(mastery.getTitle());
        favorite.setProductName(mastery.getTitle()); // backward-friendly display fallback
        favorite.setPrice(mastery.getPrice());
        favorite.setPhotoUrl(firstPhoto(mastery.getPhotoUrls()));
        favorite.setSavedAt(LocalDateTime.now());
        return favorite;
    }

    private Favorite normalizeFavorite(Favorite favorite) {
        if (favorite.getTargetType() == null || favorite.getTargetType().isBlank()) {
            favorite.setTargetType(favorite.getMasteryId() != null ? MASTERY : PRODUCT);
        }
        if (favorite.getTargetId() == null || favorite.getTargetId().isBlank()) {
            favorite.setTargetId(MASTERY.equals(favorite.getTargetType()) ? favorite.getMasteryId() : favorite.getProductId());
        }
        if (favorite.getItemName() == null || favorite.getItemName().isBlank()) {
            favorite.setItemName(favorite.getProductName());
        }
        return favorite;
    }

    private String normalizeType(String targetType) {
        String type = targetType == null ? PRODUCT : targetType.trim().toUpperCase(Locale.ROOT);
        if ("MASTERYS".equals(type) || "SERVICE".equals(type) || "SERVICES".equals(type)) {
            return MASTERY;
        }
        if (!PRODUCT.equals(type) && !MASTERY.equals(type)) {
            throw new IllegalArgumentException("Unsupported favorite target type: " + targetType);
        }
        return type;
    }

    private String firstPhoto(List<String> photos) {
        return photos == null || photos.isEmpty() ? null : photos.get(0);
    }

    private void sendFavoriteEvents(String userId, String type, String targetId, String title) {
        sendActivity(userId, "FAVORITED", targetId, type);
        // Owner notification is intentionally best-effort; favorite actions must not fail if Kafka is down.
        try {
            if (PRODUCT.equals(type)) {
                productRepository.findById(targetId).ifPresent(product -> {
                    if (product.getOwnerId() != null && !product.getOwnerId().equals(userId)) {
                        kafka.sendNotification(product.getOwnerId(), "PRODUCT_FAVORITED", "Someone liked your product!",
                                product.getName() + " was added to a wishlist", targetId);
                    }
                });
            } else {
                masteryRepository.findById(targetId).ifPresent(mastery -> {
                    if (mastery.getMasterId() != null && !mastery.getMasterId().equals(userId)) {
                        kafka.sendNotification(mastery.getMasterId(), "MASTERY_FAVORITED", "Someone liked your service!",
                                title + " was added to a wishlist", targetId);
                    }
                });
            }
        } catch (Exception ignored) {
        }
    }

    private void sendActivity(String userId, String action, String targetId, String type) {
        try {
            kafka.sendActivity(userId, action, targetId, type);
        } catch (Exception ignored) {
        }
    }
}
