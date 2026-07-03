package com.example.BackEnd_MyTools.Services;

import java.time.Instant;
import java.util.List;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.Entitys.Store;
import com.example.BackEnd_MyTools.Repositories.StoreRepo;
import com.example.BackEnd_MyTools.Security.SecurityUtils;

@Service
public class StoreService {
    final StoreRepo storeRepo;

    public StoreService(StoreRepo storeRepo) {
        this.storeRepo = storeRepo;
    }

    public Store addStore(Store store) {
        if (store.getCreatedAt() == null) store.setCreatedAt(Instant.now());
        if (store.getIsActive() == null) store.setIsActive(true);
        if (store.getIsVerified() == null) store.setIsVerified(false);
        return storeRepo.save(store);
    }

    public Store updateStore(String id, Store updatedStore, Jwt jwt) {
        return storeRepo.findById(id).map(store -> {
            assertCanManage(store, jwt);
            store.setName(updatedStore.getName());
            store.setEmail(updatedStore.getEmail());
            store.setPhone(updatedStore.getPhone());
            store.setLogo(updatedStore.getLogo());
            store.setAddress(updatedStore.getAddress());
            store.setIsActive(updatedStore.getIsActive());
            store.setDeliveryAvailable(updatedStore.isDeliveryAvailable());
            store.setAssociatsIds(updatedStore.getAssociatsIds());
            store.setSocialMedias(updatedStore.getSocialMedias());
            if (SecurityUtils.isAdmin(jwt) && updatedStore.getIsVerified() != null) {
                store.setIsVerified(updatedStore.getIsVerified());
            }
            return storeRepo.save(store);
        }).orElseThrow(() -> new IllegalArgumentException("Store not found"));
    }

    public void deleteStore(String id, Jwt jwt) {
        Store store = storeRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Store not found"));
        assertCanManage(store, jwt);
        storeRepo.deleteById(id);
    }

    public List<Store> getAllStores() {
        return storeRepo.findAll();
    }

    public Store getStore(String id) {
        return storeRepo.findById(id).orElse(null);
    }

    public Store findByOwnerId(String ownerId) {
        return storeRepo.findByOwnerIdContaining(ownerId).orElse(null);
    }

    public boolean existsByOwner(String sub) {
        return storeRepo.existsByOwnerIdContaining(sub);
    }

    public boolean existsByAssociate(String sub) {
        return storeRepo.existsByAssociatsIdsContaining(sub);
    }

    private void assertCanManage(Store store, Jwt jwt) {
        String userId = SecurityUtils.currentUserId(jwt);
        boolean owner = store.getOwnerId() != null && store.getOwnerId().contains(userId);
        boolean associate = store.getAssociatsIds() != null && store.getAssociatsIds().contains(userId);
        if (!SecurityUtils.isAdmin(jwt) && !owner && !associate) {
            throw new SecurityException("You can only manage a store that belongs to you");
        }
    }
}
