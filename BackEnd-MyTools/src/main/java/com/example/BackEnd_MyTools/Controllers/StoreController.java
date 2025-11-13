package com.example.BackEnd_MyTools.Controllers;

import java.util.List;
import java.io.IOException;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import com.example.BackEnd_MyTools.Entitys.Store;
import com.example.BackEnd_MyTools.Services.StoreService;
import org.springframework.web.bind.annotation.*;

@Controller
public class StoreController {
    final StoreService storeService;

    public StoreController(StoreService storeService) {
        this.storeService = storeService;
    }

    @PostMapping("")
    public ResponseEntity<?> AddStore(Store store) {
        try {
            Store addedstore = storeService.addStore(store);
            return ResponseEntity.ok(addedstore);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("execption msg :" + ex.getMessage());
        }
    }

    @GetMapping("")
    public ResponseEntity<?> GetAllStores() {
        try {
            List<Store> stores = storeService.getAllStores();
            return ResponseEntity.ok(stores);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("execption msg :" + ex.getMessage());
        }
    }

    @GetMapping("/Id")
    public ResponseEntity<?> GetStore(String Id) {
        try {
            Store store = storeService.getStore(Id);
            return ResponseEntity.ok(store);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("execption msg :" + ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> UpdateStore(String Id, Store store) {
        try {
            Store updatedstore = storeService.updateStore(Id, store);
            return ResponseEntity.ok(updatedstore);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("execption msg :" + ex.getMessage());
        }
    }

    @DeleteMapping("/Id")
    public ResponseEntity<?> DeleteStore(String Id) {
        try {
            storeService.deleteStore(Id);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Execption mds :" + ex.getMessage());
        }
    }

}
