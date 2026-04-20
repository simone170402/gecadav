package com.cabinetavocat.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RendezVousDto {
    private Long id;
    private String title;
    private String date;
    private String startTime;
    private String endTime;
    private String type;
    private String client;
    private Long clientId;
    private String location;
    private String notes;
    private String status;
    private Long affaireId;
}