package com.cabinetavocat.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientStatsDto {
    private long totalClients;
    private long clientsActifs;
    private long entreprises;
    private long particuliers;
}
