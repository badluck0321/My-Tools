package com.example.BackEnd_MyTools.Controllers;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.ResponseEntity;
import com.example.BackEnd_MyTools.DTO.DtoGetMastery;
import com.example.BackEnd_MyTools.Entitys.Mastery;
import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Services.MasteryService;
import com.example.BackEnd_MyTools.Services.PhotoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.BackEnd_MyTools.Mapper.MasteryMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
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


//    {
//   "id": "string",
//   "masterId": "string",
//   "title": "string",
//   "typeId": 0,
//   "price": 0,
//   "description": "string",
//   "photoId": "string"
// }
    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> AddMastery(@RequestPart("mastery") String masteryJson,
            @RequestPart(value = "photo", required = false) MultipartFile photo, @AuthenticationPrincipal Jwt jwt) 
                {
                    try {
                // ✅ Manually convert JSON to Product
                String sub = jwt.getClaim("sub");
                if (sub == null || sub.isEmpty()) {
                    return ResponseEntity.status(401).body("Utilisateur non authentifié");
                    
                }
            ObjectMapper mapper = new ObjectMapper();
            Mastery mastery = mapper.readValue(masteryJson, Mastery.class);
                if (photo != null && !photo.isEmpty()) {
                    String photoId = null;
                        String id = photoService.savePhoto(photo);
                        photoId = id;
                    mastery.setPhotoId(photoId);
                }

                Mastery addedmastery = masteryService.createMastery(mastery);
                return ResponseEntity.ok(addedmastery);

            } catch (Exception ex) {
                ex.printStackTrace();
                return ResponseEntity.status(500)
                        .body("Erreur lors de la création : " + ex.getMessage());
            }
        }


    // ✅ GET ALL PRODUCTS WITH SPECS
    @GetMapping("specials")
    public ResponseEntity<List<DtoGetMastery>> getAllMasterysSpect(HttpServletRequest request,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer typeId
            ) {
        try {
            List<Mastery> masterys = masteryService.getAllMasterysSpecs(title, typeId);

            if (masterys.isEmpty())
                return ResponseEntity.noContent().build();
            List<DtoGetMastery> getMasteryDtos = masteryMapper.toDtoList(masterys);
            return ResponseEntity.ok(getMasteryDtos);
        } catch (Exception ex) {
            return ResponseEntity.status(500).build();
        }
    
    }
    @GetMapping("")
    public ResponseEntity<?> GetAllMasterys() {
        try {
            List<Mastery> masterys = masteryService.getAllMasterys();
                        List<DtoGetMastery> getMasteryDtos = masteryMapper.toDtoList(masterys);
            return ResponseEntity.ok(getMasteryDtos);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("execption msg :" + ex.getMessage());
        }
    }

    @GetMapping("/Id")
    public ResponseEntity<?> GetMastery(String Id) {
        try {
            Mastery mastery = masteryService.getMasteryById(Id);
            return ResponseEntity.ok(mastery);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("execption msg :" + ex.getMessage());
        }
    }

    // @PutMapping("/{id}")
    // public ResponseEntity<?> UpdateMastery(String Id, Mastery mastery) {
    //     try {
    //         Mastery updatedmastery = masteryService.updateMastery(Id, mastery);
    //         return ResponseEntity.ok(updatedmastery);
    //     } catch (Exception ex) {
    //         return ResponseEntity.status(500).body("execption msg :" + ex.getMessage());
    //     }
    // }
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> UpdateMastery(
            @PathVariable String id,
            @RequestPart("mastery") String updatedMasteryJson,
            @RequestPart(value = "photos", required = false) List<MultipartFile> newPhotos) {
        try {

            ObjectMapper mapper = new ObjectMapper();
            Mastery updatedMastery = mapper.readValue(updatedMasteryJson, Mastery.class);
            
            if (newPhotos != null && !newPhotos.isEmpty()) {
                String photoId = null;
                for (MultipartFile photo : newPhotos) {
                    String id1 = photoService.savePhoto(photo);
                    photoId = id1;
                }
                updatedMastery.setPhotoId(photoId);
            }

            masteryService.updateMastery(id, updatedMastery);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Erreur lors de la mise à jour : " + ex.getMessage());
        }
    }

    @DeleteMapping("/Id")
    public ResponseEntity<?> DeleteMastery(String Id) {
        try {
            masteryService.deleteMastery(Id);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Execption mds :" + ex.getMessage());
        }
    }

}
