package com.cabinetavocat.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatItemDto {
    private String label;
    private String value;
    private String change;
    private String trend;
    private String icon;
    private String color;
}