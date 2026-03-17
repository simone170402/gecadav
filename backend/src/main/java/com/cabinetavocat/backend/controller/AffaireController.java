package com.cabinetavocat.backend.controller;


import com.cabinetavocat.backend.auth.dto.AffaireRequest;
import com.cabinetavocat.backend.model.Affaire;
import com.cabinetavocat.backend.service.AffaireService;
import org.springframework.http.ResponseEntity;
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
    public List<Affaire> getAllAffaires() {
        return affaireService.getAllAffaires();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Affaire> getAffaireById(@PathVariable Long id) {
        return affaireService.getAffaireById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Affaire> createAffaire(@RequestBody AffaireRequest request) {
        return ResponseEntity.ok(affaireService.createAffaire(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Affaire> updateAffaire(@PathVariable Long id, @RequestBody AffaireRequest request) {
        return ResponseEntity.ok(affaireService.updateAffaire(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAffaire(@PathVariable Long id) {
        affaireService.deleteAffaire(id);
        return ResponseEntity.noContent().build();
    }
}
