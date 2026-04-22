package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.SubscribeRequestDto;
import com.cabinetavocat.backend.auth.dto.UserSubscriptionDto;

public interface UserSubscriptionService {
    UserSubscriptionDto subscribe(SubscribeRequestDto dto);
    boolean hasActiveSubscription(String userEmail);
}