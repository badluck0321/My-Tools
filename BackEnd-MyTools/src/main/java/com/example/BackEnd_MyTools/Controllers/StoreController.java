package com.example.BackEnd_MyTools.Controllers;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import org.springframework.http.ResponseEntity;
import com.example.BackEnd_MyTools.Entitys.Store;
import com.example.BackEnd_MyTools.Services.StoreService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stores")
public class StoreController {
    final StoreService storeService;

    public StoreController(StoreService storeService) {
        this.storeService = storeService;
    }

    // @PostMapping("")
    // public ResponseEntity<?> AddStore(Store store) {
    //     try {
    //         Store addedstore = storeService.addStore(store);
    //         return ResponseEntity.ok(addedstore);
    //     } catch (Exception ex) {
    //         return ResponseEntity.status(500).body("execption msg :" + ex.getMessage());
    //     }
    // }

    @PostMapping("")
    public ResponseEntity<?> createStore(
            @RequestBody Store store,
            @AuthenticationPrincipal Jwt jwt) {

        String sub = jwt.getClaim("sub");
        if (sub == null || sub.isEmpty()) {
            return ResponseEntity.status(401).body("Non authentifié");
        }

        // Option A — block owners AND associates
        boolean alreadyOwns = storeService.existsByOwner(sub);
        boolean alreadyAssociate = storeService.existsByAssociate(sub);
        if (alreadyOwns || alreadyAssociate) {
            return ResponseEntity.status(409)
                .body("You are already linked to a store");
        }

        // // Option B — block owners only (comment out alreadyAssociate check)
        // if (alreadyOwns) {
        //     return ResponseEntity.status(409)
        //         .body("You already own a store");
        // }

        store.setOwnerId(List.of(sub));   // force ownerId from token, not from body
        Store created = storeService.addStore(store);
        return ResponseEntity.ok(created);
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

    @GetMapping("/stores/mine")
    public ResponseEntity<?> getMyStore(@AuthenticationPrincipal Jwt jwt) {
        String sub = jwt.getClaim("sub");
        if (sub == null || sub.isEmpty()) {
            return ResponseEntity.status(401).body("Utilisateur non authentifié");
        }
        Store store = storeService.findByOwnerId(sub);
        return store != null
                ? ResponseEntity.ok(store)
                : ResponseEntity.noContent().build(); // 204 = no store found
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
