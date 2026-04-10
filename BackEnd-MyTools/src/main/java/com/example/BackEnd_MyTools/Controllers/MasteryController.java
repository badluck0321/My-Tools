package com.example.BackEnd_MyTools.Controllers;
import java.util.List;
import org.springframework.http.ResponseEntity;
import com.example.BackEnd_MyTools.DTO.GetMasteryDto;
import com.example.BackEnd_MyTools.Entitys.Mastery;
import com.example.BackEnd_MyTools.Services.MasteryService;
import com.example.BackEnd_MyTools.Mapper.MasteryMapper;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/masterys")
public class MasteryController {
    final MasteryService masteryService;

    public MasteryController(MasteryService masteryService) {
        this.masteryService = masteryService;
    }

    @PostMapping("")
    public ResponseEntity<?> AddMastery(Mastery mastery) {
        try {
            Mastery addedmastery = masteryService.createMastery(mastery);
            return ResponseEntity.ok(addedmastery);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("execption msg :" + ex.getMessage());
        }
    }


    // ✅ GET ALL PRODUCTS WITH SPECS
    @GetMapping("specials")
    public ResponseEntity<List<GetMasteryDto>> getAllMasterysSpect(HttpServletRequest request,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer typeId
            ) {
        try {
            List<Mastery> masterys = masteryService.getAllMasterysSpecs(title, typeId);

            if (masterys.isEmpty())
                return ResponseEntity.noContent().build();
            List<GetMasteryDto> getMasteryDtos = MasteryMapper.toDtoList(masterys);
            return ResponseEntity.ok(getMasteryDtos);
        } catch (Exception ex) {
            return ResponseEntity.status(500).build();
        }
    
    }
    @GetMapping("")
    public ResponseEntity<?> GetAllMasterys() {
        try {
            List<Mastery> masterys = masteryService.getAllMasterys();
            return ResponseEntity.ok(masterys);
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

    @PutMapping("/{id}")
    public ResponseEntity<?> UpdateMastery(String Id, Mastery mastery) {
        try {
            Mastery updatedmastery = masteryService.updateMastery(Id, mastery);
            return ResponseEntity.ok(updatedmastery);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("execption msg :" + ex.getMessage());
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
