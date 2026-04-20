package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.AffaireDto;
import com.cabinetavocat.backend.auth.dto.AffaireStatsDto;

import java.util.List;

public interface AffaireService {
    List<AffaireDto> getAllAffaires();
    AffaireDto getAffaireById(Long id);
    AffaireDto createAffaire(AffaireDto affaireDto);
    AffaireDto updateAffaire(Long id, AffaireDto affaireDto);
    void deleteAffaire(Long id);
    AffaireStatsDto getAffaireStats();
}