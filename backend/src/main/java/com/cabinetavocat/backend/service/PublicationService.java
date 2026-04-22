package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.PublicationListItemDto;
import com.cabinetavocat.backend.auth.dto.PublicationRequestDto;
import com.cabinetavocat.backend.auth.dto.PublicationResponseDto;
import com.cabinetavocat.backend.model.PublicationType;

import java.util.List;

public interface PublicationService {

    PublicationResponseDto create(PublicationRequestDto dto);

    PublicationResponseDto update(Long id, PublicationRequestDto dto);

    void delete(Long id);

    List<PublicationListItemDto> getPublishedByType(PublicationType type, String category);

    List<PublicationListItemDto> getFeaturedByType(PublicationType type);

    PublicationResponseDto getBySlug(String slug, String userEmail);

    PublicationResponseDto getAdminById(Long id);

    List<PublicationListItemDto> getAllAdminPublications();
}