package com.example.BackEnd_MyTools.Controllers;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.BackEnd_MyTools.Entitys.Demande;
import com.example.BackEnd_MyTools.Services.DemandeService;

@RestController
public class DemandeController {
    private final DemandeService demandeService;

    public DemandeController(DemandeService demandeService) {
        this.demandeService = demandeService;
    }

    @PostMapping("/demandes")
    public ResponseEntity<?> createDemande(Demande demande) {
        try {
            Demande createdDemande = demandeService.createDemande(demande);
            return ResponseEntity.ok().body(createdDemande);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error: " + ex.getMessage());
        }
    }

    @GetMapping("/demandes")
    public ResponseEntity<List<Demande>> getAllDemandes() {
        List<Demande> demandes = demandeService.getAllDemandes();
        try {
            if (demandes.isEmpty()) {
                return ResponseEntity.noContent().build();
            } else {
            }
            return ResponseEntity.ok(demandes);
        } catch (Exception ex) {
            return ResponseEntity.status(500).build();
        }

    }

    @GetMapping("/demandes/{id}")
    public ResponseEntity<Demande> getDemandeById(String id) {
        Demande demande = demandeService.getDemandeById(id);
        try {
            if (demande == null) {
                return ResponseEntity.notFound().build();
            } else {
                return ResponseEntity.ok(demande);
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/demandes/{id}")
    public ResponseEntity<?> updateDemande(String id, Demande updatedDemande) {
        Demande demande = demandeService.updateDemande(id, updatedDemande);
        try {
            if (demande == null) {
                return ResponseEntity.notFound().build();
            } else {
                return ResponseEntity.ok(demande);
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error: " + ex.getMessage());
        }
    }

    @DeleteMapping("/demandes/{id}")
    public ResponseEntity<?> deleteDemandeById(String id) {
        try {
            demandeService.deleteDemande(id);
            return ResponseEntity.ok().body("deleted succesfuly");
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Erreur" + ex.getMessage());
        }
    }
}
