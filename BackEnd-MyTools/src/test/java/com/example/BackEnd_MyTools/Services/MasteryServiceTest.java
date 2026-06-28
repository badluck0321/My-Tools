package com.example.BackEnd_MyTools.Services;

import com.example.BackEnd_MyTools.Entitys.Mastery;
import com.example.BackEnd_MyTools.Repositories.MasteryRepo;
import com.example.BackEnd_MyTools.testsupport.JwtTestFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MasteryServiceTest {
    @Mock
    MasteryRepo masteryRepo;
    @Mock
    MongoTemplate mongoTemplate;
    @InjectMocks
    MasteryService masteryService;

    @Test
    void updateMasteryKeepsExistingPhotosWhenUpdateHasNullPhotoList() {
        Mastery e = new Mastery();
        e.setId("M001");
        e.setMasterId("U001");
        e.setPhotoUrls(List.of("existing-photo"));
        Mastery u = new Mastery();
        u.setTitle("Updated service");
        u.setPhotoUrls(null);
        when(masteryRepo.findById("M001")).thenReturn(Optional.of(e));
        when(masteryRepo.save(any(Mastery.class))).thenAnswer(i -> i.getArgument(0));
        Mastery saved = masteryService.updateMastery("M001", u, JwtTestFactory.user("U001"));
        assertThat(saved.getTitle()).isEqualTo("Updated service");
        assertThat(saved.getPhotoUrls()).containsExactly("existing-photo");
    }
}
