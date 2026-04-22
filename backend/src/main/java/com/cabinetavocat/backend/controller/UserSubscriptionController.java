package com.cabinetavocat.backend.controller;

import com.cabinetavocat.backend.auth.dto.SubscribeRequestDto;
import com.cabinetavocat.backend.auth.dto.UserSubscriptionDto;
import com.cabinetavocat.backend.service.UserSubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class UserSubscriptionController {

    private final UserSubscriptionService userSubscriptionService;

    @PostMapping
    public UserSubscriptionDto subscribe(@Valid @RequestBody SubscribeRequestDto dto) {
        return userSubscriptionService.subscribe(dto);
    }

    @GetMapping("/check")
    public boolean hasSubscription(@RequestParam String userEmail) {
        return userSubscriptionService.hasActiveSubscription(userEmail);
    }
}
