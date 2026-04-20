package com.cabinetavocat.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcurationDto {
    private Long id;
    private String reference;
    private Long clientId;
    private String client;
    private String type;
    private String status;
    private String createdDate;
    private String expiryDate;
    private String scope;
    private String signedBy;
}