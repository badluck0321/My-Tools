package com.example.BackEnd_MyTools.Controllers;
import com.example.BackEnd_MyTools.Entitys.Lookups;
import com.example.BackEnd_MyTools.Services.LookupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/Lookups")
public class LookupController {

    @Autowired
    private LookupService lookupService;

    // Get all lookups
    @GetMapping
    public List<Lookups> getAllLookups() {
        return lookupService.getAllLookups();
    }

    // Get a lookup by ID
    @GetMapping("/{id}")
    public Lookups getLookupById(@PathVariable String id) {
        return lookupService.getLookupById(id);
    }

    // Create a new lookup
    @PostMapping
    public Lookups createLookup(@RequestBody Lookups lookup) {
        return lookupService.createLookup(lookup);
    }

    // Update a lookup
    @PutMapping("/{id}")
    public Lookups updateLookup(@PathVariable String id, @RequestBody Lookups lookup) {
        return lookupService.updateLookups(id, lookup);
    }

    // Delete a lookup
    @DeleteMapping("/{id}")
    public void deleteLookup(@PathVariable String id) {
        lookupService.deleteLookup(id);
    }
}