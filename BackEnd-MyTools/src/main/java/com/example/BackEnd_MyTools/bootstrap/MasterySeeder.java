package com.example.BackEnd_MyTools.bootstrap;

import com.example.BackEnd_MyTools.Entitys.Mastery;
import com.example.BackEnd_MyTools.Repositories.MasteryRepo;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class MasterySeeder {

    private final MasteryRepo masteryRepository;
    private final ObjectMapper objectMapper;
    @Value("${mytools.seed.cloudinary-base-url:https://res.cloudinary.com/dkmhbowlx/image/upload}")
    private String cloudinaryBaseUrl;

    public MasterySeeder(
            MasteryRepo masteryRepository,
            ObjectMapper objectMapper) {

        this.masteryRepository = masteryRepository;
        this.objectMapper = objectMapper;
    }

    public void seed() {

        if (masteryRepository.count() > 0) {
            System.out.println("[Seeder] Mastery already exists, skipping...");
            return;
        }

        try (InputStream inputStream = new ClassPathResource("seed/mastery.json").getInputStream()) {

            // ✅ READ AS GENERIC MAP (NOT ENTITY)
            List<Map<String, Object>> rawList = objectMapper.readValue(
                    inputStream,
                    new TypeReference<List<Map<String, Object>>>() {
                    });

            List<Mastery> masteries = rawList.stream()
                    .map(this::mapToEntity)
                    .toList();

            masteryRepository.saveAll(masteries);

            System.out.println("[Seeder] Mastery seeded successfully!");

        } catch (Exception e) {
            throw new RuntimeException("Failed to seed Mastery data", e);
        }
    }

    private Mastery mapToEntity(Map<String, Object> data) {

        Mastery m = new Mastery();

        m.masterId = (String) data.get("masterId");
        m.masterName = (String) data.get("masterName");
        m.masterPhone = (String) data.get("masterPhone");
        m.title = (String) data.get("title");
        m.masteryTypeId = (Integer) data.get("masteryTypeId");
        m.masteryStatuId = (String) data.get("masteryStatuId");
        m.pricingType = (String) data.get("pricingType");
        m.price = (Integer) data.get("price");
        m.city = (String) data.get("city");
        m.experienceYears = (Integer) data.get("experienceYears");
        m.description = (String) data.get("description");
        // Cloudinary image handling: seed URLs directly, no generated images and no network download.
        List<String> imagesUrlsList = (List<String>) data.get("seedImageUrl");
        if (imagesUrlsList != null && !imagesUrlsList.isEmpty()) {
            m.photoUrls = new ArrayList<>(imagesUrlsList.stream().map(this::cloudinaryImage).toList());
        }

        return m;
    }

    private String cloudinaryImage(String imageUrlOrPath) {
        if (imageUrlOrPath == null || imageUrlOrPath.isBlank()) return null;
        if (imageUrlOrPath.startsWith("http://") || imageUrlOrPath.startsWith("https://")) return imageUrlOrPath;
        return cloudinaryBaseUrl.replaceAll("/+$", "") + "/" + imageUrlOrPath.replaceAll("^/+", "");
    }
}