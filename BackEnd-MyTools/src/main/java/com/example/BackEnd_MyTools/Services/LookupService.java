package com.example.BackEnd_MyTools.Services;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.Entitys.Lookups;
import com.example.BackEnd_MyTools.Repositories.LookupRepository;

@Service
public class LookupService {
    private final LookupRepository lookupRepo;

    public LookupService(LookupRepository lookupRepo) {
        this.lookupRepo = lookupRepo;
    }

    public Lookups createLookup(Lookups lookup) {
        validate(lookup);
        lookup.setType(normalizeType(lookup.getType()));
        return lookupRepo.save(lookup);
    }

    public Lookups updateLookups(String id, Lookups lookup) {
        validate(lookup);
        return lookupRepo.findById(id).map(existing -> {
            existing.setType(normalizeType(lookup.getType()));
            existing.setCode(lookup.getCode());
            existing.setValue(lookup.getValue());
            existing.setActive(lookup.isActive());
            return lookupRepo.save(existing);
        }).orElseThrow(() -> new IllegalArgumentException("Lookup not found"));
    }

    public List<Lookups> getAllLookups() {
        return lookupRepo.findAll();
    }

    public List<Lookups> getActiveLookupsByType(String type) {
        return lookupRepo.findByTypeAndIsActiveTrue(normalizeType(type));
    }

    public Lookups getLookupById(String id) {
        return lookupRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Lookup not found"));
    }

    public void deleteLookup(String id) {
        lookupRepo.deleteById(id);
    }

    private void validate(Lookups lookup) {
        if (lookup.getType() == null || lookup.getType().isBlank()) {
            throw new IllegalArgumentException("Lookup type is required");
        }
        if (lookup.getCode() == null || lookup.getCode().isBlank()) {
            throw new IllegalArgumentException("Lookup code is required");
        }
        if (lookup.getValue() == null || lookup.getValue().isBlank()) {
            throw new IllegalArgumentException("Lookup value is required");
        }
    }

    private String normalizeType(String type) {
        return type == null ? null : type.trim().toUpperCase(Locale.ROOT);
    }
}
