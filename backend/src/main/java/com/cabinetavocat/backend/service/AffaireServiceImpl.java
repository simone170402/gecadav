package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.AffaireDto;
import com.cabinetavocat.backend.auth.dto.AffaireStatsDto;
import com.cabinetavocat.backend.model.Affaire;
import com.cabinetavocat.backend.model.Client;
import com.cabinetavocat.backend.repository.AffaireRepository;
import com.cabinetavocat.backend.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AffaireServiceImpl implements AffaireService {

    private final AffaireRepository affaireRepository;
    private final ClientRepository clientRepository;

    public AffaireServiceImpl(AffaireRepository affaireRepository, ClientRepository clientRepository) {
        this.affaireRepository = affaireRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    public List<AffaireDto> getAllAffaires() {
        return affaireRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public AffaireDto getAffaireById(Long id) {
        Affaire affaire = affaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Affaire introuvable avec l'id : " + id));

        return mapToDto(affaire);
    }

    @Override
    public AffaireDto createAffaire(AffaireDto affaireDto) {
        Client client = clientRepository.findById(affaireDto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client introuvable avec l'id : " + affaireDto.getClientId()));

        Affaire affaire = Affaire.builder()
                .titre(affaireDto.getTitre())
                .description(affaireDto.getDescription())
                .type(affaireDto.getType())
                .statut(affaireDto.getStatut() != null ? affaireDto.getStatut() : "En attente")
                .priorite(affaireDto.getPriorite() != null ? affaireDto.getPriorite() : "medium")
                .assigneA(affaireDto.getAssigneA())
                .dateOuverture(
                        affaireDto.getDateOuverture() != null && !affaireDto.getDateOuverture().isBlank()
                                ? LocalDate.parse(affaireDto.getDateOuverture())
                                : LocalDate.now()
                )
                .dateEcheance(
                        affaireDto.getDateEcheance() != null && !affaireDto.getDateEcheance().isBlank()
                                ? LocalDate.parse(affaireDto.getDateEcheance())
                                : null
                )
                .progression(affaireDto.getProgression() != null ? affaireDto.getProgression() : 0)
                .client(client)
                .build();

        Affaire saved = affaireRepository.save(affaire);
        return mapToDto(saved);
    }

    @Override
    public AffaireDto updateAffaire(Long id, AffaireDto affaireDto) {
        Affaire affaire = affaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Affaire introuvable avec l'id : " + id));

        Client client = clientRepository.findById(affaireDto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client introuvable avec l'id : " + affaireDto.getClientId()));

        affaire.setTitre(affaireDto.getTitre());
        affaire.setDescription(affaireDto.getDescription());
        affaire.setType(affaireDto.getType());
        affaire.setStatut(affaireDto.getStatut());
        affaire.setPriorite(affaireDto.getPriorite());
        affaire.setAssigneA(affaireDto.getAssigneA());
        affaire.setDateOuverture(
                affaireDto.getDateOuverture() != null && !affaireDto.getDateOuverture().isBlank()
                        ? LocalDate.parse(affaireDto.getDateOuverture())
                        : affaire.getDateOuverture()
        );
        affaire.setDateEcheance(
                affaireDto.getDateEcheance() != null && !affaireDto.getDateEcheance().isBlank()
                        ? LocalDate.parse(affaireDto.getDateEcheance())
                        : null
        );
        affaire.setProgression(affaireDto.getProgression() != null ? affaireDto.getProgression() : 0);
        affaire.setClient(client);

        Affaire updated = affaireRepository.save(affaire);
        return mapToDto(updated);
    }

    @Override
    public void deleteAffaire(Long id) {
        Affaire affaire = affaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Affaire introuvable avec l'id : " + id));

        affaireRepository.delete(affaire);
    }

    @Override
    public AffaireStatsDto getAffaireStats() {
        return AffaireStatsDto.builder()
                .totalAffaires(affaireRepository.count())
                .enCours(affaireRepository.countByStatutIgnoreCase("En cours"))
                .urgentes(affaireRepository.countByPrioriteIgnoreCase("high"))
                .cloturees(affaireRepository.countByStatutIgnoreCase("Clôturée"))
                .build();
    }

    private AffaireDto mapToDto(Affaire affaire) {
        String clientNom = "";
        if (affaire.getClient() != null) {
            clientNom = (affaire.getClient().getPrenom() + " " + affaire.getClient().getNom()).trim();
            if (affaire.getClient().getEntreprise() != null && !affaire.getClient().getEntreprise().isBlank()) {
                clientNom += " - " + affaire.getClient().getEntreprise();
            }
        }

        return AffaireDto.builder()
                .id(affaire.getId())
                .reference(formatAffaireReference(affaire.getId(), affaire.getDateOuverture()))
                .titre(affaire.getTitre())
                .description(affaire.getDescription())
                .client(clientNom)
                .clientId(affaire.getClient() != null ? affaire.getClient().getId() : null)
                .type(affaire.getType())
                .statut(affaire.getStatut())
                .priorite(affaire.getPriorite())
                .assigneA(affaire.getAssigneA())
                .dateOuverture(affaire.getDateOuverture() != null ? affaire.getDateOuverture().toString() : null)
                .dateEcheance(affaire.getDateEcheance() != null ? affaire.getDateEcheance().toString() : null)
                .progression(affaire.getProgression())
                .build();
    }

    private String formatAffaireReference(Long id, LocalDate dateOuverture) {
        int year = dateOuverture != null ? dateOuverture.getYear() : LocalDate.now().getYear();
        long safeId = id != null ? id : 0L;
        return String.format("AFF-%d-%03d", year, safeId);
    }
}