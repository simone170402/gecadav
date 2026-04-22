package com.cabinetavocat.backend.auth.dto;

import com.cabinetavocat.backend.model.PublicationStatus;
import com.cabinetavocat.backend.model.PublicationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PublicationRequestDto {

    @NotBlank
    private String title;

    @NotBlank
    private String excerpt;

    @NotBlank
    private String content;

    @NotBlank
    private String category;

    @NotBlank
    private String author;

    private String coverImageUrl;

    @NotNull
    private PublicationType type;

    @NotNull
    private PublicationStatus status;

    private Boolean premium;
    private Boolean featured;
    private Integer estimatedReadTime;
    private String previewContent;
}
