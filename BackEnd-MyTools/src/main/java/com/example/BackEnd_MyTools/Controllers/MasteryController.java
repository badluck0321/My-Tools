package com.example.BackEnd_MyTools.Controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.BackEnd_MyTools.DTO.DtoGetMastery;
import com.example.BackEnd_MyTools.Entitys.Mastery;
import com.example.BackEnd_MyTools.Mapper.MasteryMapper;
import com.example.BackEnd_MyTools.Services.MasteryService;
import com.example.BackEnd_MyTools.Services.PhotoService;
import com.example.BackEnd_MyTools.Security.SecurityUtils;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/masterys")
public class MasteryController {
    private final MasteryService masteryService;
    private final PhotoService photoService;
    private final MasteryMapper masteryMapper;

    public MasteryController(MasteryService masteryService, PhotoService photoService, MasteryMapper masteryMapper) {
        this.masteryService = masteryService;
        this.photoService = photoService;
        this.masteryMapper = masteryMapper;
    }

    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addMastery(@RequestPart("mastery") String masteryJson,
            @RequestPart(value = "photos", required = false) List<MultipartFile> photos,
            @AuthenticationPrincipal Jwt jwt) {
        try {
            Mastery mastery = new ObjectMapper().readValue(masteryJson, Mastery.class);
            if (photos != null && !photos.isEmpty()) {
                List<String> photoIds = new ArrayList<>();
                for (MultipartFile photo : photos)
                    photoIds.add(photoService.savePhoto(photo));
                mastery.setPhotoUrls(photoIds);
            }
            return ResponseEntity.ok(masteryService.createMastery(mastery, jwt));
        } catch (SecurityException | IllegalArgumentException ex) {
            throw ex;
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Erreur lors de la création : " + ex.getMessage());
        }
    }

    @GetMapping({"", "specials"})
    public ResponseEntity<List<DtoGetMastery>> getAllMasterysSpect(HttpServletRequest request,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer typeId,
            @RequestParam(required = false) String masterId) {
        List<Mastery> masterys = masteryService.getAllMasterysSpecs(title, typeId, masterId);
        String baseUrl = String.format("%s://%s:%d%s", request.getScheme(), request.getServerName(),
                request.getServerPort(), request.getContextPath());
        return ResponseEntity.ok(masteryMapper.toDtoList(masterys, baseUrl));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<Mastery>> getMyMasterys(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(masteryService.getMyMasterys(SecurityUtils.currentUserId(jwt)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DtoGetMastery> getMastery(@PathVariable String id, HttpServletRequest request) {
        Mastery mastery = masteryService.getMasteryById(id);
        if (mastery == null)
            return ResponseEntity.notFound().build();
        String baseUrl = String.format("%s://%s:%d%s", request.getScheme(), request.getServerName(),
                request.getServerPort(), request.getContextPath());
        return ResponseEntity.ok(masteryMapper.toDto(mastery, baseUrl));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateMastery(@PathVariable String id,
            @RequestPart("mastery") String updatedMasteryJson,
            @RequestPart(value = "photos", required = false) List<MultipartFile> newPhotos,
            @AuthenticationPrincipal Jwt jwt) {
        try {
            Mastery updatedMastery = new ObjectMapper().readValue(updatedMasteryJson, Mastery.class);
            if (newPhotos != null && !newPhotos.isEmpty()) {
                List<String> photoIds = new ArrayList<>();
                for (MultipartFile photo : newPhotos)
                    photoIds.add(photoService.savePhoto(photo));
                updatedMastery.setPhotoUrls(photoIds);
            }
            return ResponseEntity.ok(masteryService.updateMastery(id, updatedMastery, jwt));
        } catch (SecurityException | IllegalArgumentException ex) {
            throw ex;
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Erreur lors de la mise à jour : " + ex.getMessage());
        }
    }

    @GetMapping("/photos/{photoUrls}")
    public ResponseEntity<byte[]> getPhoto(@PathVariable String photoUrls) throws IOException {
        return photoService.getPhoto(photoUrls)
                .map(photoData -> ResponseEntity.ok().contentType(MediaType.parseMediaType(photoData.contentType()))
                        .body(photoData.bytes()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMastery(@PathVariable String id, @AuthenticationPrincipal Jwt jwt) {
        masteryService.deleteMastery(id, jwt);
        return ResponseEntity.ok().build();
    }
}
