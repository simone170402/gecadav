package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.ProcurationDto;
import com.cabinetavocat.backend.auth.dto.ProcurationStatsDto;
import com.cabinetavocat.backend.model.Procuration;

import java.util.List;

public interface ProcurationService {
    List<ProcurationDto> getAllProcurations();
    ProcurationDto getProcurationById(Long id);
    ProcurationDto createProcuration(ProcurationDto dto);
    ProcurationDto updateProcuration(Long id, ProcurationDto dto);
    void deleteProcuration(Long id);
    ProcurationStatsDto getStats();
    Procuration getEntityById(Long id);
}