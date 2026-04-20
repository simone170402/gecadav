package com.cabinetavocat.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentCaseDto {
    private String id;
    private String client;
    private String type;
    private String status;
    private String deadline;
    private String priority;
}