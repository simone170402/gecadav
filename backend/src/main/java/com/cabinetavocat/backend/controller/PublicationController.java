package com.cabinetavocat.backend.controller;

import com.cabinetavocat.backend.auth.dto.PublicationListItemDto;
import com.cabinetavocat.backend.auth.dto.PublicationResponseDto;
import com.cabinetavocat.backend.model.PublicationType;
import com.cabinetavocat.backend.service.PublicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publications")
@RequiredArgsConstructor
public class PublicationController {

    private final PublicationService publicationService;

    @GetMapping
    public List<PublicationListItemDto> getPublications(
            @RequestParam PublicationType type,
            @RequestParam(required = false) String category
    ) {
        return publicationService.getPublishedByType(type, category);
    }

    @GetMapping("/featured")
    public List<PublicationListItemDto> getFeatured(
            @RequestParam PublicationType type
    ) {
        return publicationService.getFeaturedByType(type);
    }

    @GetMapping("/{slug}")
    public PublicationResponseDto getBySlug(
            @PathVariable String slug,
            @RequestParam(required = false) String userEmail
    ) {
        return publicationService.getBySlug(slug, userEmail);
    }
}