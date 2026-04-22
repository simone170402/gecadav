package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.SubscriptionPlanDto;
import java.util.List;

public interface SubscriptionPlanService {
    List<SubscriptionPlanDto> getActivePlans();
}