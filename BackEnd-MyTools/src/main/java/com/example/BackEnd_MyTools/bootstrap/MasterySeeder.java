package com.example.BackEnd_MyTools.bootstrap;

import com.example.BackEnd_MyTools.Entitys.Mastery;
import com.example.BackEnd_MyTools.Repositories.MasteryRepo;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;

@Service
public class MasterySeeder {

    private final MasteryRepo masteryRepository;
    private final ObjectMapper objectMapper;

    public MasterySeeder(MasteryRepo masteryRepository, ObjectMapper objectMapper) {
        this.masteryRepository = masteryRepository;
        this.objectMapper = objectMapper;
    }

    public void seed() {

        if (masteryRepository.count() > 0) {
            System.out.println("[Seeder] Mastery already exists, skipping...");
            return;
        }

        try (InputStream inputStream = new ClassPathResource("seed/mastery.json").getInputStream()) {

            List<Mastery> masteries = objectMapper.readValue(
                    inputStream,
                    new TypeReference<List<Mastery>>() {
                    });

            masteryRepository.saveAll(masteries);

            System.out.println("[Seeder] Mastery seeded successfully!");

        } catch (Exception e) {
            throw new RuntimeException("Failed to seed Mastery data", e);
        }
    }
}