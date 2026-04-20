package com.cabinetavocat.backend.controller;

import com.cabinetavocat.backend.auth.dto.AffaireDto;
import com.cabinetavocat.backend.auth.dto.AffaireStatsDto;
import com.cabinetavocat.backend.service.AffaireService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/affaires")
public class AffaireController {

    private final AffaireService affaireService;

    public AffaireController(AffaireService affaireService) {
        this.affaireService = affaireService;
    }

    @GetMapping
    public List<AffaireDto> getAllAffaires() {
        return affaireService.getAllAffaires();
    }

    @GetMapping("/{id}")
    public AffaireDto getAffaireById(@PathVariable Long id) {
        return affaireService.getAffaireById(id);
    }

    @PostMapping
    public AffaireDto createAffaire(@RequestBody AffaireDto affaireDto) {
        return affaireService.createAffaire(affaireDto);
    }

    @PutMapping("/{id}")
    public AffaireDto updateAffaire(@PathVariable Long id, @RequestBody AffaireDto affaireDto) {
        return affaireService.updateAffaire(id, affaireDto);
    }

    @DeleteMapping("/{id}")
    public void deleteAffaire(@PathVariable Long id) {
        affaireService.deleteAffaire(id);
    }

    @GetMapping("/stats")
    public AffaireStatsDto getAffaireStats() {
        return affaireService.getAffaireStats();
    }
}