package com.cabinetavocat.backend.controller;

import com.cabinetavocat.backend.model.RendezVous;
import com.cabinetavocat.backend.service.RendezVousService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rendezvous")
@CrossOrigin
public class RendezVousController {

    private final RendezVousService service;

    public RendezVousController(RendezVousService service) {
        this.service = service;
    }

    @GetMapping
    public List<RendezVous> getAll() {
        return service.getAll();
    }

    @PostMapping
    public RendezVous create(@RequestBody RendezVous rdv) {
        return service.create(rdv);
    }

    @PutMapping("/{id}")
    public RendezVous update(@PathVariable Long id, @RequestBody RendezVous rdv) {
        return service.update(id, rdv);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}