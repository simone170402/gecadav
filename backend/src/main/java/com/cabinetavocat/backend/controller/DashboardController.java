package com.cabinetavocat.backend.controller;

import com.cabinetavocat.backend.auth.dto.DashboardResponseDto;
import com.cabinetavocat.backend.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardResponseDto getDashboard() {
        return dashboardService.getDashboardData();
    }
}