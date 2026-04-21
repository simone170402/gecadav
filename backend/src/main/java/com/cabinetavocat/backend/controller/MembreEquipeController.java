package com.cabinetavocat.backend.controller;

import com.cabinetavocat.backend.auth.dto.EquipeStatsDto;
import com.cabinetavocat.backend.auth.dto.MembreEquipeDto;
import com.cabinetavocat.backend.auth.dto.MembreProfilDto;
import com.cabinetavocat.backend.service.MembreEquipeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipe")
public class MembreEquipeController {

    private final MembreEquipeService membreEquipeService;

    public MembreEquipeController(MembreEquipeService membreEquipeService) {
        this.membreEquipeService = membreEquipeService;
    }

    @GetMapping
    public List<MembreEquipeDto> getAll() {
        return membreEquipeService.getAll();
    }

    @GetMapping("/{id}")
    public MembreEquipeDto getById(@PathVariable Long id) {
        return membreEquipeService.getById(id);
    }

    @PostMapping
    public MembreEquipeDto create(@RequestBody MembreEquipeDto dto) {
        return membreEquipeService.create(dto);
    }

    @GetMapping("/{id}/profil")
    public MembreProfilDto getProfil(@PathVariable Long id) {
        return membreEquipeService.getProfil(id);
    }

    @PutMapping("/{id}")
    public MembreEquipeDto update(@PathVariable Long id, @RequestBody MembreEquipeDto dto) {
        return membreEquipeService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        membreEquipeService.delete(id);
    }

    @GetMapping("/stats")
    public EquipeStatsDto getStats() {
        return membreEquipeService.getStats();
    }
}