package com.example.BackEnd_MyTools.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.Entitys.Lookups;
import com.example.BackEnd_MyTools.Repositories.LookupRepository;

@Service
public class LookupService {
    private final LookupRepository lookupRepo;

    public LookupService(LookupRepository lookupRepo) {
        this.lookupRepo = lookupRepo;
    }

    public Lookups createLookup(Lookups lookups) {
        return lookupRepo.save(lookups);
    }

    public Lookups updateLookups(String id, Lookups lookup) {
        return lookupRepo.findById(id).map(lookups -> {
            lookups.setValue(lookup.getValue());
            return lookupRepo.save(lookups);
        }).orElse(null);
    }

    public List<Lookups> getAllLookups() {
        return lookupRepo.findAll();
    }

    public Lookups getLookupById(String id) {
        return lookupRepo.findById(id).orElse(null);
    }

    public void deleteLookup(String id) {
        lookupRepo.deleteById(id);
    }

}
