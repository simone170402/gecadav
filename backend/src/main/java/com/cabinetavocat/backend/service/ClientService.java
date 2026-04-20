package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.ClientDto;
import com.cabinetavocat.backend.auth.dto.ClientStatsDto;

import java.util.List;

public interface ClientService {
    List<ClientDto> getAllClients();
    ClientDto getClientById(Long id);
    ClientDto createClient(ClientDto clientDto);
    ClientDto updateClient(Long id, ClientDto clientDto);
    void deleteClient(Long id);
    ClientStatsDto getClientStats();
}