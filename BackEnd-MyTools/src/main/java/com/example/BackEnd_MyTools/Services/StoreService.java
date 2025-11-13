package com.example.BackEnd_MyTools.Services;

import java.util.List;

import org.springframework.stereotype.Service;
import com.example.BackEnd_MyTools.Entitys.Store;
import com.example.BackEnd_MyTools.Repositories.StoreRepo;

@Service
public class StoreService {
    final StoreRepo storeRepo;

    public StoreService(StoreRepo storeRepo) {
        this.storeRepo = storeRepo;
    }

    public List<Store> getAllStores() {
        return storeRepo.findAll();
    }

    public Store getStore(String Id) {
        return storeRepo.findById(Id).orElse(null);
    }

    public Store addStore(Store store) {
        return storeRepo.save(store);
    }

    public Store updateStore(String Id, Store updatedstore) {
        return storeRepo.findById(Id).map(store -> {
            store.setName(updatedstore.getName());
            store.setEmail(updatedstore.getEmail());
            store.setIsActive(updatedstore.getIsActive());
            store.setIsVerified(updatedstore.getIsVerified());
            store.setAssociatsId(updatedstore.getAssociatsId());
            store.setSocialMedias(updatedstore.getSocialMedias());

            return storeRepo.save(store);
        }).orElse(null);
    }

    public void deleteStore(String Id) {
        storeRepo.deleteById(Id);
    }

}
