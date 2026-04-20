package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.TacheDto;

import java.util.List;

public interface TacheService {
    List<TacheDto> getAll();
    TacheDto create(TacheDto dto);
    TacheDto toggle(Long id);
    void delete(Long id);
}