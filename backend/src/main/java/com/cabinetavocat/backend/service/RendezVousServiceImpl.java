package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.RendezVousDto;
import com.cabinetavocat.backend.model.Affaire;
import com.cabinetavocat.backend.model.Client;
import com.cabinetavocat.backend.model.RendezVous;
import com.cabinetavocat.backend.repository.AffaireRepository;
import com.cabinetavocat.backend.repository.ClientRepository;
import com.cabinetavocat.backend.repository.RendezVousRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class RendezVousServiceImpl implements RendezVousService {

    private final RendezVousRepository rendezVousRepository;
    private final ClientRepository clientRepository;
    private final AffaireRepository affaireRepository;

    public RendezVousServiceImpl(
            RendezVousRepository rendezVousRepository,
            ClientRepository clientRepository,
            AffaireRepository affaireRepository
    ) {
        this.rendezVousRepository = rendezVousRepository;
        this.clientRepository = clientRepository;
        this.affaireRepository = affaireRepository;
    }

    @Override
    public List<RendezVousDto> getAllRendezVous() {
        return rendezVousRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public List<RendezVousDto> getUpcomingRendezVous() {
        return rendezVousRepository.findTop5ByDateGreaterThanEqualOrderByDateAscHeureAsc(LocalDate.now())
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public RendezVousDto createRendezVous(RendezVousDto dto) {
        Client client = null;
        if (dto.getClientId() != null) {
            client = clientRepository.findById(dto.getClientId())
                    .orElseThrow(() -> new RuntimeException("Client introuvable avec l'id : " + dto.getClientId()));
        }

        Affaire affaire = null;
        if (dto.getAffaireId() != null) {
            affaire = affaireRepository.findById(dto.getAffaireId())
                    .orElseThrow(() -> new RuntimeException("Affaire introuvable avec l'id : " + dto.getAffaireId()));
        }

        RendezVous rdv = RendezVous.builder()
                .date(LocalDate.parse(dto.getDate()))
                .heure(LocalTime.parse(dto.getStartTime()))
                .heureFin(LocalTime.parse(dto.getEndTime()))
                .typeRendezVous(dto.getType())
                .lieu(dto.getLocation())
                .note(dto.getNotes())
                .statut(dto.getStatus() != null && !dto.getStatus().isBlank() ? dto.getStatus() : "PLANIFIE")
                .client(client)
                .affaire(affaire)
                .build();

        RendezVous saved = rendezVousRepository.save(rdv);
        return mapToDto(saved);
    }

    @Override
    public void deleteRendezVous(Long id) {
        RendezVous rdv = rendezVousRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous introuvable avec l'id : " + id));

        rendezVousRepository.delete(rdv);
    }

    private RendezVousDto mapToDto(RendezVous rdv) {
        String clientName = "";
        if (rdv.getClient() != null) {
            clientName = (rdv.getClient().getPrenom() + " " + rdv.getClient().getNom()).trim();
        }

        return RendezVousDto.builder()
                .id(rdv.getId())
                .title(rdv.getTypeRendezVous() + " - " + clientName)
                .date(rdv.getDate() != null ? rdv.getDate().toString() : null)
                .startTime(rdv.getHeure() != null ? rdv.getHeure().toString() : null)
                .endTime(rdv.getHeureFin() != null ? rdv.getHeureFin().toString() : null)
                .type(rdv.getTypeRendezVous())
                .client(clientName)
                .clientId(rdv.getClient() != null ? rdv.getClient().getId() : null)
                .location(rdv.getLieu())
                .notes(rdv.getNote())
                .status(rdv.getStatut())
                .affaireId(rdv.getAffaire() != null ? rdv.getAffaire().getId() : null)
                .build();
    }
}