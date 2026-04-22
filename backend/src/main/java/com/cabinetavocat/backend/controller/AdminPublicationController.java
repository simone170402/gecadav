package com.cabinetavocat.backend.controller;

import com.cabinetavocat.backend.auth.dto.PublicationListItemDto;
import com.cabinetavocat.backend.auth.dto.PublicationRequestDto;
import com.cabinetavocat.backend.auth.dto.PublicationResponseDto;
import com.cabinetavocat.backend.service.PublicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/publications")
@RequiredArgsConstructor
public class AdminPublicationController {

    private final PublicationService publicationService;

    @PostMapping
    public PublicationResponseDto create(@Valid @RequestBody PublicationRequestDto dto) {
        return publicationService.create(dto);
    }

    @PutMapping("/{id}")
    public PublicationResponseDto update(@PathVariable Long id, @Valid @RequestBody PublicationRequestDto dto) {
        return publicationService.update(id, dto);
    }

    @GetMapping
    public List<PublicationListItemDto> getAll() {
        return publicationService.getAllAdminPublications();
    }

    @GetMapping("/{id}")
    public PublicationResponseDto getById(@PathVariable Long id) {
        return publicationService.getAdminById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        publicationService.delete(id);
    }
}
