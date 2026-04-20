package com.cabinetavocat.backend.auth.dto;

public record LoginResponse(
    String token,
    String email,
    String role
) {}