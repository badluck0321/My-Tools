package com.example.BackEnd_MyTools.Controllers;

import com.example.BackEnd_MyTools.Entitys.Lookups;
import com.example.BackEnd_MyTools.Services.LookupService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping({ "/api/Lookups", "/lookups" })
@RequiredArgsConstructor
public class LookupController {

    private final LookupService lookupService;

    @GetMapping
    public List<Lookups> getAllLookups(@RequestParam(required = false) String type) {
        return type == null || type.isBlank()
                ? lookupService.getAllLookups()
                : lookupService.getActiveLookupsByType(type);
    }

    @GetMapping("/type/{type}")
    public List<Lookups> getLookupsByType(@PathVariable String type) {
        return lookupService.getActiveLookupsByType(type);
    }

    @GetMapping("/{id}")
    public Lookups getLookupById(@PathVariable String id) {
        return lookupService.getLookupById(id);
    }

    @PostMapping
    public Lookups createLookup(@RequestBody Lookups lookup) {
        return lookupService.createLookup(lookup);
    }

    @PutMapping("/{id}")
    public Lookups updateLookup(@PathVariable String id, @RequestBody Lookups lookup) {
        return lookupService.updateLookups(id, lookup);
    }

    @DeleteMapping("/{id}")
    public void deleteLookup(@PathVariable String id) {
        lookupService.deleteLookup(id);
    }
}
