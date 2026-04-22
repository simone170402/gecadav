package com.cabinetavocat.backend.auth.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserSubscriptionDto {
    private Long id;
    private Long planId;
    private String planName;
    private String userEmail;
    private Boolean active;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean autoRenew;
}
