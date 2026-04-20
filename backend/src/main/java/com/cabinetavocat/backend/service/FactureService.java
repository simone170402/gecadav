package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.FactureDto;
import com.cabinetavocat.backend.auth.dto.FactureStatsDto;

import java.util.List;

public interface FactureService {
    List<FactureDto> getAllFactures();
    FactureDto getFactureById(Long id);
    FactureDto createFacture(FactureDto factureDto);
    FactureDto updateFacture(Long id, FactureDto factureDto);
    void deleteFacture(Long id);
    FactureStatsDto getFactureStats();
    com.cabinetavocat.backend.model.Facture getEntityById(Long id);
}