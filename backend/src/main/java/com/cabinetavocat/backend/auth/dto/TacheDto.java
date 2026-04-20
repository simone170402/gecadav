package com.cabinetavocat.backend.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TacheDto {
    private Long id;
    private String titre;
    private String dueDate;
    private String priority;
    private boolean completed;
    private String assignedTo;
    private Long clientId;
    private Long affaireId;
}