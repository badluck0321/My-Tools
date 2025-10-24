package com.example.BackEnd_MyTools.Services;

import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.Entitys.Demande;
import com.example.BackEnd_MyTools.Repositories.DemandeRepo;

@Service
public class DemandeService {
    private final DemandeRepo demandeRepo;

    public DemandeService(DemandeRepo demandeRepo) {
        this.demandeRepo = demandeRepo;
    }

    public Demande createDemande(Demande demande) {
        return demandeRepo.save(demande);
    }
    
    public java.util.List<Demande> getAllDemandes() {
        return demandeRepo.findAll();
    }
    public Demande getDemandeById(int id) {
        return demandeRepo.findById(id).orElse(null);
    }
    public void deleteDemande(int id) {
        demandeRepo.deleteById(id);
    }

    public Demande updateDemande(int id, Demande updatedDemande) {
        return demandeRepo.findById(id).map(demande -> {
            demande.setTitle(updatedDemande.getTitle());
            demande.setTypeId(updatedDemande.getTypeId());
            demande.setPrice(updatedDemande.getPrice());
            demande.setDescription(updatedDemande.getDescription());
            return demandeRepo.save(demande);
        }).orElse(null);
    }

    
}
