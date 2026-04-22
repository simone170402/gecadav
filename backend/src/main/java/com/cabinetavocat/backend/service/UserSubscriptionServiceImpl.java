package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.SubscribeRequestDto;
import com.cabinetavocat.backend.auth.dto.UserSubscriptionDto;
import com.cabinetavocat.backend.model.SubscriptionPlan;
import com.cabinetavocat.backend.model.UserSubscription;
import com.cabinetavocat.backend.repository.SubscriptionPlanRepository;
import com.cabinetavocat.backend.repository.UserSubscriptionRepository;
import com.cabinetavocat.backend.service.UserSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserSubscriptionServiceImpl implements UserSubscriptionService {

    private final UserSubscriptionRepository subscriptionRepository;
    private final SubscriptionPlanRepository planRepository;

    @Override
    public UserSubscriptionDto subscribe(SubscribeRequestDto dto) {
        SubscriptionPlan plan = planRepository.findById(dto.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan introuvable"));

        UserSubscription subscription = UserSubscription.builder()
                .userEmail(dto.getUserEmail())
                .plan(plan)
                .active(true)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(plan.getDurationInDays()))
                .autoRenew(false)
                .build();

        subscription = subscriptionRepository.save(subscription);

        return UserSubscriptionDto.builder()
                .id(subscription.getId())
                .planId(plan.getId())
                .planName(plan.getName())
                .userEmail(subscription.getUserEmail())
                .active(subscription.getActive())
                .startDate(subscription.getStartDate())
                .endDate(subscription.getEndDate())
                .autoRenew(subscription.getAutoRenew())
                .build();
    }

    @Override
    public boolean hasActiveSubscription(String userEmail) {
        return subscriptionRepository.findFirstByUserEmailAndActiveTrueOrderByEndDateDesc(userEmail)
                .map(UserSubscription::isValid)
                .orElse(false);
    }
}