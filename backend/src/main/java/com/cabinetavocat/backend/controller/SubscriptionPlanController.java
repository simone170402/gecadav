package com.cabinetavocat.backend.controller;

import com.cabinetavocat.backend.auth.dto.SubscriptionPlanDto;
import com.cabinetavocat.backend.service.SubscriptionPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscription-plans")
@RequiredArgsConstructor
public class SubscriptionPlanController {

    private final SubscriptionPlanService subscriptionPlanService;

    @GetMapping
    public List<SubscriptionPlanDto> getPlans() {
        return subscriptionPlanService.getActivePlans();
    }
}