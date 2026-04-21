package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.EquipeStatsDto;
import com.cabinetavocat.backend.auth.dto.MembreEquipeDto;
import com.cabinetavocat.backend.auth.dto.MembreProfilDto;

import java.util.List;

public interface MembreEquipeService {
    List<MembreEquipeDto> getAll();
    MembreEquipeDto getById(Long id);
    MembreEquipeDto create(MembreEquipeDto dto);
    MembreEquipeDto update(Long id, MembreEquipeDto dto);
    void delete(Long id);
    EquipeStatsDto getStats();
    MembreProfilDto getProfil(Long id);
}