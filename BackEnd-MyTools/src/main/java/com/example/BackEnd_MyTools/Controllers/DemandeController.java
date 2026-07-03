package com.example.BackEnd_MyTools.Controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
    public ResponseEntity<Demande> createDemande(@RequestBody Demande demande) {
        return ResponseEntity.ok(demandeService.createDemande(demande));
    }

    @GetMapping("/demandes")
    public ResponseEntity<List<Demande>> getAllDemandes() {
        return ResponseEntity.ok(demandeService.getAllDemandes());
    }

    @GetMapping("/demandes/{id}")
    public ResponseEntity<Demande> getDemandeById(@PathVariable String id) {
        Demande demande = demandeService.getDemandeById(id);
        return demande == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(demande);
    }

    @PutMapping("/demandes/{id}")
    public ResponseEntity<Demande> updateDemande(@PathVariable String id, @RequestBody Demande updatedDemande) {
        Demande demande = demandeService.updateDemande(id, updatedDemande);
        return demande == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(demande);
    }

    @DeleteMapping("/demandes/{id}")
    public ResponseEntity<Void> deleteDemandeById(@PathVariable String id) {
        demandeService.deleteDemande(id);
        return ResponseEntity.noContent().build();
    }
}
