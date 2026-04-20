package com.cabinetavocat.backend.auth.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyActivityDto {
    private String month;
    private int affaires;
    private int clients;
}
