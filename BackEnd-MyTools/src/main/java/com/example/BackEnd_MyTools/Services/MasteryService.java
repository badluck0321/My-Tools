package com.example.BackEnd_MyTools.Services;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.mongodb.core.MongoTemplate;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.Entitys.Mastery;
import com.example.BackEnd_MyTools.Repositories.MasteryRepo;
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

    public List<Mastery> getAllMasterysSpecs(String title,Integer typeId) {
        List<Criteria> criteriaList = new ArrayList<>();

        Criteria c1 = MasterySpecs.hasTitleLike(title);
        Criteria c2 = MasterySpecs.hasTypeId(typeId);

        if (c1 != null)
            criteriaList.add(c1);
        if (c2 != null)
            criteriaList.add(c2);

        Query query = new Query();

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return mongoTemplate.find(query, Mastery.class);
    }

    public Mastery getMasteryById(String id) {
        return masteryRepo.findById(id).orElse(null);
    }

    public Mastery createMastery(Mastery mastery) {
        return masteryRepo.save(mastery);
    }

    public Mastery updateMastery(String id, Mastery updatedmastery) {
        return masteryRepo.findById(id).map(mastery -> {
            mastery.setTitle(updatedmastery.getTitle());
            mastery.setDescription(updatedmastery.getDescription());
            mastery.setPrice(updatedmastery.getPrice());
            mastery.setTypeId(updatedmastery.getTypeId());
            return masteryRepo.save(mastery);
        }).orElse(null);
    }

    public void deleteMastery(String id) {
        masteryRepo.deleteById(id);
    }

}
