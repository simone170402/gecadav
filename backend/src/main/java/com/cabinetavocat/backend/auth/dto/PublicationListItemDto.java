package com.cabinetavocat.backend.auth.dto;

import com.cabinetavocat.backend.model.PublicationType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PublicationListItemDto {
    private Long id;
    private String title;
    private String slug;
    private String excerpt;
    private String category;
    private String author;
    private String coverImageUrl;
    private PublicationType type;
    private Boolean premium;
    private Boolean featured;
    private Integer views;
    private Integer estimatedReadTime;
    private LocalDateTime publishedAt;
}