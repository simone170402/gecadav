package com.cabinetavocat.backend.controller;

import com.cabinetavocat.backend.auth.dto.TacheDto;
import com.cabinetavocat.backend.service.TacheService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/taches")
public class TacheController {

    private final TacheService service;

    public TacheController(TacheService service) {
        this.service = service;
    }

    @GetMapping
    public List<TacheDto> getAll() {
        return service.getAll();
    }

    @PostMapping
    public TacheDto create(@RequestBody TacheDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}/toggle")
    public TacheDto toggle(@PathVariable Long id) {
        return service.toggle(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}