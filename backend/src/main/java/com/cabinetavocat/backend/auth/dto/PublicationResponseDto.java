package com.cabinetavocat.backend.auth.dto;

import com.cabinetavocat.backend.model.PublicationStatus;
import com.cabinetavocat.backend.model.PublicationType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PublicationResponseDto {
    private Long id;
    private String title;
    private String slug;
    private String excerpt;
    private String content;
    private String category;
    private String author;
    private String coverImageUrl;
    private PublicationType type;
    private PublicationStatus status;
    private Boolean premium;
    private Boolean featured;
    private Integer views;
    private Integer estimatedReadTime;
    private String previewContent;
    private Boolean hasAccess;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
