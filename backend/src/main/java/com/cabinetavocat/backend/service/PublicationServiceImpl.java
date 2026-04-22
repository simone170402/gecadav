package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.PublicationListItemDto;
import com.cabinetavocat.backend.auth.dto.PublicationRequestDto;
import com.cabinetavocat.backend.auth.dto.PublicationResponseDto;
import com.cabinetavocat.backend.model.Publication;
import com.cabinetavocat.backend.model.PublicationStatus;
import com.cabinetavocat.backend.model.PublicationType;
import com.cabinetavocat.backend.repository.PublicationRepository;
import com.cabinetavocat.backend.service.PublicationService;
import com.cabinetavocat.backend.service.UserSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PublicationServiceImpl implements PublicationService {

    private final PublicationRepository publicationRepository;
    private final UserSubscriptionService userSubscriptionService;

    @Override
    public PublicationResponseDto create(PublicationRequestDto dto) {
        Publication publication = mapToEntity(new Publication(), dto);

        publication.setSlug(generateSlug(dto.getTitle()));

        if (dto.getStatus() == PublicationStatus.PUBLISHED) {
            publication.setPublishedAt(LocalDateTime.now());
        }

        validatePublication(dto);
        return mapToResponse(publicationRepository.save(publication), true);
    }

    @Override
    public PublicationResponseDto update(Long id, PublicationRequestDto dto) {
        Publication publication = publicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publication introuvable"));

        publication = mapToEntity(publication, dto);

        if (publication.getSlug() == null || publication.getSlug().isBlank()) {
            publication.setSlug(generateSlug(dto.getTitle()));
        }

        if (dto.getStatus() == PublicationStatus.PUBLISHED && publication.getPublishedAt() == null) {
            publication.setPublishedAt(LocalDateTime.now());
        }

        validatePublication(dto);
        return mapToResponse(publicationRepository.save(publication), true);
    }

    @Override
    public void delete(Long id) {
        publicationRepository.deleteById(id);
    }

    @Override
    public List<PublicationListItemDto> getPublishedByType(PublicationType type, String category) {
        List<Publication> publications;

        if (category != null && !category.isBlank() && !"Tous".equalsIgnoreCase(category)) {
            publications = publicationRepository.findByTypeAndStatusAndCategoryIgnoreCaseOrderByPublishedAtDesc(
                    type, PublicationStatus.PUBLISHED, category
            );
        } else {
            publications = publicationRepository.findByTypeAndStatusOrderByPublishedAtDesc(
                    type, PublicationStatus.PUBLISHED
            );
        }

        return publications.stream().map(this::mapToListItem).toList();
    }

    @Override
    public List<PublicationListItemDto> getFeaturedByType(PublicationType type) {
        return publicationRepository
                .findByTypeAndStatusAndFeaturedTrueOrderByPublishedAtDesc(
                        type, PublicationStatus.PUBLISHED, PageRequest.of(0, 3)
                )
                .stream()
                .map(this::mapToListItem)
                .toList();
    }


    @Override
    public PublicationResponseDto getBySlug(String slug, String userEmail) {
        Publication publication = publicationRepository.findBySlugAndStatus(slug, PublicationStatus.PUBLISHED)
                .orElseThrow(() -> new RuntimeException("Publication introuvable"));

        boolean hasAccess = !Boolean.TRUE.equals(publication.getPremium())
                || (userEmail != null && userSubscriptionService.hasActiveSubscription(userEmail));

        publication.setViews(publication.getViews() + 1);
        publicationRepository.save(publication);

        return mapToResponse(publication, hasAccess);
    }

    @Override
    public List<PublicationListItemDto> getAllAdminPublications() {
        return publicationRepository.findAll().stream()
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null && b.getCreatedAt() == null) return 0;
                    if (a.getCreatedAt() == null) return 1;
                    if (b.getCreatedAt() == null) return -1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .map(this::mapToListItem)
                .toList();
    }

    @Override
    public PublicationResponseDto getAdminById(Long id) {
        Publication publication = publicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publication introuvable"));

        return mapToResponse(publication, true);
    }

    private Publication mapToEntity(Publication publication, PublicationRequestDto dto) {
        publication.setTitle(dto.getTitle());
        publication.setExcerpt(dto.getExcerpt());
        publication.setContent(dto.getContent());
        publication.setCategory(dto.getCategory());
        publication.setAuthor(dto.getAuthor());
        publication.setCoverImageUrl(dto.getCoverImageUrl());
        publication.setType(dto.getType());
        publication.setStatus(dto.getStatus());
        publication.setPremium(dto.getPremium() != null ? dto.getPremium() : false);
        publication.setFeatured(dto.getFeatured() != null ? dto.getFeatured() : false);
        publication.setEstimatedReadTime(dto.getEstimatedReadTime());
        publication.setPreviewContent(dto.getPreviewContent());
        return publication;
    }

    private PublicationListItemDto mapToListItem(Publication publication) {
        return PublicationListItemDto.builder()
                .id(publication.getId())
                .title(publication.getTitle())
                .slug(publication.getSlug())
                .excerpt(publication.getExcerpt())
                .category(publication.getCategory())
                .author(publication.getAuthor())
                .coverImageUrl(publication.getCoverImageUrl())
                .type(publication.getType())
                .premium(publication.getPremium())
                .featured(publication.getFeatured())
                .views(publication.getViews())
                .estimatedReadTime(publication.getEstimatedReadTime())
                .publishedAt(publication.getPublishedAt())
                .build();
    }

    private PublicationResponseDto mapToResponse(Publication publication, boolean hasAccess) {
        return PublicationResponseDto.builder()
                .id(publication.getId())
                .title(publication.getTitle())
                .slug(publication.getSlug())
                .excerpt(publication.getExcerpt())
                .content(hasAccess ? publication.getContent() : publication.getPreviewContent())
                .category(publication.getCategory())
                .author(publication.getAuthor())
                .coverImageUrl(publication.getCoverImageUrl())
                .type(publication.getType())
                .status(publication.getStatus())
                .premium(publication.getPremium())
                .featured(publication.getFeatured())
                .views(publication.getViews())
                .estimatedReadTime(publication.getEstimatedReadTime())
                .previewContent(publication.getPreviewContent())
                .hasAccess(hasAccess)
                .publishedAt(publication.getPublishedAt())
                .createdAt(publication.getCreatedAt())
                .updatedAt(publication.getUpdatedAt())
                .build();
    }

    private String generateSlug(String title) {
        String baseSlug = title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("\\s+", "-");

        String slug = baseSlug;
        int counter = 1;

        while (publicationRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + counter;
            counter++;
        }

        return slug;
    }

    private void validatePublication(PublicationRequestDto dto) {
    if (Boolean.TRUE.equals(dto.getPremium())) {
        if (dto.getPreviewContent() == null || dto.getPreviewContent().isBlank()) {
            throw new RuntimeException("Le contenu d’aperçu est obligatoire pour une publication premium.");
        }
    }
}
}