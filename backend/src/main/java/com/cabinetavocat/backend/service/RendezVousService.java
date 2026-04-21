package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.RendezVousDto;

import java.util.List;

public interface RendezVousService {
    List<RendezVousDto> getAllRendezVous();
    List<RendezVousDto> getUpcomingRendezVous();
    RendezVousDto createRendezVous(RendezVousDto dto);
    void deleteRendezVous(Long id);
}