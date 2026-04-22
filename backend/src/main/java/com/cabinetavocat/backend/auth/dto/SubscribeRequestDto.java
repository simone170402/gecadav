package com.cabinetavocat.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubscribeRequestDto {

    @NotNull
    private Long planId;

    @Email
    private String userEmail;
}
