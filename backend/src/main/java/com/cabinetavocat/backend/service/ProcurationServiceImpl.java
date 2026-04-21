package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.ProcurationDto;
import com.cabinetavocat.backend.auth.dto.ProcurationStatsDto;
import com.cabinetavocat.backend.model.Client;
import com.cabinetavocat.backend.model.Procuration;
import com.cabinetavocat.backend.repository.ClientRepository;
import com.cabinetavocat.backend.repository.ProcurationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ProcurationServiceImpl implements ProcurationService {

    private final ProcurationRepository procurationRepository;
    private final ClientRepository clientRepository;

    public ProcurationServiceImpl(
            ProcurationRepository procurationRepository,
            ClientRepository clientRepository
    ) {
        this.procurationRepository = procurationRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    public List<ProcurationDto> getAllProcurations() {
        List<Procuration> procurations = procurationRepository.findAll();

        procurations.forEach(this::refreshStatusIfExpired);

        return procurations.stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public ProcurationDto getProcurationById(Long id) {
        Procuration procuration = procurationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Procuration introuvable avec l'id : " + id));

        refreshStatusIfExpired(procuration);

        return mapToDto(procuration);
    }

    @Override
    public ProcurationDto createProcuration(ProcurationDto dto) {
        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client introuvable avec l'id : " + dto.getClientId()));

        LocalDate createdDate = dto.getCreatedDate() != null && !dto.getCreatedDate().isBlank()
                ? LocalDate.parse(dto.getCreatedDate())
                : LocalDate.now();

        LocalDate expiryDate = dto.getExpiryDate() != null && !dto.getExpiryDate().isBlank()
                ? LocalDate.parse(dto.getExpiryDate())
                : createdDate.plusMonths(12);

        Procuration procuration = Procuration.builder()
                .client(client)
                .type(dto.getType())
                .scope(dto.getScope())
                .status(dto.getStatus() != null && !dto.getStatus().isBlank() ? dto.getStatus() : "Active")
                .createdDate(createdDate)
                .expiryDate(expiryDate)
                .signedBy(dto.getSignedBy())
                .build();

        Procuration saved = procurationRepository.save(procuration);
        return mapToDto(saved);
    }

    @Override
    public void deleteProcuration(Long id) {
        Procuration procuration = procurationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Procuration introuvable avec l'id : " + id));

        procurationRepository.delete(procuration);
    }

    @Override
    public Procuration getEntityById(Long id) {
        Procuration procuration = procurationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Procuration introuvable avec l'id : " + id));

        refreshStatusIfExpired(procuration);
        return procuration;
    }

    @Override
    public ProcurationDto updateProcuration(Long id, ProcurationDto dto) {
        Procuration procuration = procurationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Procuration introuvable avec l'id : " + id));

        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client introuvable avec l'id : " + dto.getClientId()));

        procuration.setClient(client);
        procuration.setType(dto.getType());
        procuration.setScope(dto.getScope());
        procuration.setStatus(dto.getStatus());
        procuration.setSignedBy(dto.getSignedBy());

        if (dto.getCreatedDate() != null && !dto.getCreatedDate().isBlank()) {
            procuration.setCreatedDate(LocalDate.parse(dto.getCreatedDate()));
        }

        if (dto.getExpiryDate() != null && !dto.getExpiryDate().isBlank()) {
            procuration.setExpiryDate(LocalDate.parse(dto.getExpiryDate()));
        }

        Procuration updated = procurationRepository.save(procuration);
        return mapToDto(updated);
    }

    @Override
    public ProcurationStatsDto getStats() {
        return ProcurationStatsDto.builder()
                .total(procurationRepository.count())
                .actives(procurationRepository.countByStatusIgnoreCase("Active"))
                .enAttente(procurationRepository.countByStatusIgnoreCase("En attente"))
                .expirees(procurationRepository.countByStatusIgnoreCase("Expirée"))
                .build();
    }

    private ProcurationDto mapToDto(Procuration procuration) {
        String clientName = "";
        if (procuration.getClient() != null) {
            clientName = (procuration.getClient().getPrenom() + " " + procuration.getClient().getNom()).trim();
        }

        return ProcurationDto.builder()
                .id(procuration.getId())
                .reference(formatReference(procuration.getId(), procuration.getCreatedDate()))
                .clientId(procuration.getClient() != null ? procuration.getClient().getId() : null)
                .client(clientName)
                .type(procuration.getType())
                .status(procuration.getStatus())
                .createdDate(procuration.getCreatedDate() != null ? procuration.getCreatedDate().toString() : null)
                .expiryDate(procuration.getExpiryDate() != null ? procuration.getExpiryDate().toString() : null)
                .scope(procuration.getScope())
                .signedBy(procuration.getSignedBy())
                .build();
    }

    private String formatReference(Long id, LocalDate createdDate) {
        int year = createdDate != null ? createdDate.getYear() : LocalDate.now().getYear();
        long safeId = id != null ? id : 0L;
        return String.format("PROC-%d-%03d", year, safeId);
    }

    private void refreshStatusIfExpired(Procuration procuration) {
        if (procuration.getExpiryDate() != null &&
            procuration.getExpiryDate().isBefore(LocalDate.now()) &&
            !"Expirée".equalsIgnoreCase(procuration.getStatus())) {

            procuration.setStatus("Expirée");
            procurationRepository.save(procuration);
        }
    }

}
