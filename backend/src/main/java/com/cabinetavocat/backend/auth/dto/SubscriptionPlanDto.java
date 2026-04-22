package com.cabinetavocat.backend.auth.dto;

import com.cabinetavocat.backend.model.BillingCycle;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class SubscriptionPlanDto {
    private Long id;
    private String name;
    private BillingCycle billingCycle;
    private BigDecimal price;
    private Integer durationInDays;
    private Boolean active;
    private String description;
}