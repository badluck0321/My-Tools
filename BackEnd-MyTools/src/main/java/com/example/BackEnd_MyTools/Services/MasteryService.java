package com.example.BackEnd_MyTools.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.Entitys.Mastery;
import com.example.BackEnd_MyTools.Repositories.MasteryRepo;
import com.example.BackEnd_MyTools.Security.SecurityUtils;
import com.example.BackEnd_MyTools.Specifications.MasterySpecs;

@Service
public class MasteryService {
    private final MasteryRepo masteryRepo;
    private final MongoTemplate mongoTemplate;

    public MasteryService(MasteryRepo masteryRepo, MongoTemplate mongoTemplate) {
        this.masteryRepo = masteryRepo;
        this.mongoTemplate = mongoTemplate;
    }

    public List<Mastery> getAllMasterys() {
        return masteryRepo.findAll();
    }

    public List<Mastery> getMyMasterys(String masterId) {
        return masteryRepo.findByMasterIdOrderByIdDesc(masterId);
    }

    public List<Mastery> getAllMasterysSpecs(String title, Integer typeId, String masterId) {
        List<Criteria> criteriaList = new ArrayList<>();
        Criteria c1 = MasterySpecs.hasTitleLike(title);
        Criteria c2 = MasterySpecs.hasTypeId(typeId);
        Criteria c3 = MasterySpecs.hasMasterId(masterId);
        if (c1 != null)
            criteriaList.add(c1);
        if (c2 != null)
            criteriaList.add(c2);
        if (c3 != null)
            criteriaList.add(c3);
        Query query = new Query();
        if (!criteriaList.isEmpty())
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        return mongoTemplate.find(query, Mastery.class);
    }

    public Mastery getMasteryById(String id) {
        return masteryRepo.findById(id).orElse(null);
    }

    public Mastery createMastery(Mastery mastery, Jwt jwt) {
        mastery.setMasterId(SecurityUtils.currentUserId(jwt));
        if (mastery.getMasterName() == null || mastery.getMasterName().isBlank())
            mastery.setMasterName(SecurityUtils.currentUsername(jwt));
        return masteryRepo.save(mastery);
    }

    public Mastery updateMastery(String id, Mastery updatedmastery, Jwt jwt) {
        return masteryRepo.findById(id).map(mastery -> {
            assertCanManage(mastery, jwt);
            mastery.setTitle(updatedmastery.getTitle());
            mastery.setMasterName(updatedmastery.getMasterName());
            mastery.setMasterPhone(updatedmastery.getMasterPhone());
            mastery.setMasteryTypeId(updatedmastery.getMasteryTypeId());
            mastery.setMasteryStatuId(updatedmastery.getMasteryStatuId());
            mastery.setPricingType(updatedmastery.getPricingType());
            mastery.setPrice(updatedmastery.getPrice());
            mastery.setCity(updatedmastery.getCity());
            mastery.setExperienceYears(updatedmastery.getExperienceYears());
            mastery.setDescription(updatedmastery.getDescription());
            if (updatedmastery.getPhotoUrls() != null && !updatedmastery.getPhotoUrls().isEmpty())
                mastery.setPhotoUrls(updatedmastery.getPhotoUrls());
            return masteryRepo.save(mastery);
        }).orElseThrow(() -> new IllegalArgumentException("Mastery not found"));
    }

    public void deleteMastery(String id, Jwt jwt) {
        Mastery mastery = masteryRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Mastery not found"));
        assertCanManage(mastery, jwt);
        masteryRepo.deleteById(id);
    }

    private void assertCanManage(Mastery mastery, Jwt jwt) {
        String userId = SecurityUtils.currentUserId(jwt);
        if (!SecurityUtils.isAdmin(jwt) && (mastery.getMasterId() == null || !mastery.getMasterId().equals(userId))) {
            throw new SecurityException("You can only manage your own services");
        }
    }
}
