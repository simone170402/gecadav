package com.cabinetavocat.backend.controller;

import com.cabinetavocat.backend.auth.dto.RendezVousDto;
import com.cabinetavocat.backend.service.RendezVousService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rendezvous")
public class RendezVousController {

    private final RendezVousService rendezVousService;

    public RendezVousController(RendezVousService rendezVousService) {
        this.rendezVousService = rendezVousService;
    }

    @GetMapping
    public List<RendezVousDto> getAllRendezVous() {
        return rendezVousService.getAllRendezVous();
    }

    @GetMapping("/upcoming")
    public List<RendezVousDto> getUpcomingRendezVous() {
        return rendezVousService.getUpcomingRendezVous();
    }

    @PostMapping
    public RendezVousDto createRendezVous(@RequestBody RendezVousDto dto) {
        return rendezVousService.createRendezVous(dto);
    }

    @DeleteMapping("/{id}")
    public void deleteRendezVous(@PathVariable Long id) {
        rendezVousService.deleteRendezVous(id);
    }
}