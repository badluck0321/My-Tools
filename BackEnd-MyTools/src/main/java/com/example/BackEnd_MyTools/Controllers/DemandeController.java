package com.example.BackEnd_MyTools.Controllers;

import java.util.List;

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
    public Demande createDemande(Demande demande) {
        return demandeService.createDemande(demande);
    }

    @GetMapping("/demandes")
    public List<Demande> getAllDemandes() {
        return demandeService.getAllDemandes();
    }

    @GetMapping("/demandes/{id}")
    public Demande getDemandeById(int id) {
        return demandeService.getDemandeById(id);
    }

    @PutMapping("/demandes/{id}")
    public Demande updateDemande(int id, Demande updatedDemande) {
        return demandeService.updateDemande(id, updatedDemande);
    }

    @DeleteMapping("/demandes/{id}")
    public void deleteDemandeById(int id) {
        demandeService.deleteDemande(id);
    }
}
