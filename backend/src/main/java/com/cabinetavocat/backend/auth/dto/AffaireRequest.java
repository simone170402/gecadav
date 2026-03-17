package com.cabinetavocat.backend.auth.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AffaireRequest {
    private String titre;
    private String description;
    private String statut;
    private LocalDate dateOuverture;
    private Long clientId;
}
