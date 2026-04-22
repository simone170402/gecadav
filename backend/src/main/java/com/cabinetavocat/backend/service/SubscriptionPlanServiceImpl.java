package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.SubscriptionPlanDto;
import com.cabinetavocat.backend.repository.SubscriptionPlanRepository;
import com.cabinetavocat.backend.service.SubscriptionPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionPlanServiceImpl implements SubscriptionPlanService {

    private final SubscriptionPlanRepository repository;

    @Override
    public List<SubscriptionPlanDto> getActivePlans() {
        return repository.findByActiveTrue().stream()
                .map(plan -> SubscriptionPlanDto.builder()
                        .id(plan.getId())
                        .name(plan.getName())
                        .billingCycle(plan.getBillingCycle())
                        .price(plan.getPrice())
                        .durationInDays(plan.getDurationInDays())
                        .active(plan.getActive())
                        .description(plan.getDescription())
                        .build())
                .toList();
    }
}
