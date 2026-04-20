package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.AffaireMiniDto;
import com.cabinetavocat.backend.auth.dto.EquipeStatsDto;
import com.cabinetavocat.backend.auth.dto.MembreEquipeDto;
import com.cabinetavocat.backend.auth.dto.MembreProfilDto;
import com.cabinetavocat.backend.auth.dto.TacheMiniDto;
import com.cabinetavocat.backend.model.MembreEquipe;
import com.cabinetavocat.backend.repository.AffaireRepository;
import com.cabinetavocat.backend.repository.MembreEquipeRepository;
import com.cabinetavocat.backend.repository.TacheRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MembreEquipeServiceImpl implements MembreEquipeService {

    private final MembreEquipeRepository membreEquipeRepository;
    private final AffaireRepository affaireRepository;
    private final TacheRepository tacheRepository;

    public MembreEquipeServiceImpl(
            MembreEquipeRepository membreEquipeRepository,
            AffaireRepository affaireRepository,
            TacheRepository tacheRepository
    ) {
        this.membreEquipeRepository = membreEquipeRepository;
        this.affaireRepository = affaireRepository;
        this.tacheRepository = tacheRepository;

    }

    @Override
    public List<MembreEquipeDto> getAll() {
        return membreEquipeRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public MembreEquipeDto getById(Long id) {
        MembreEquipe membre = membreEquipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Membre introuvable avec l'id : " + id));

        return mapToDto(membre);
    }

    @Override
    public MembreEquipeDto create(MembreEquipeDto dto) {
        MembreEquipe membre = MembreEquipe.builder()
                .nomComplet(dto.getNomComplet())
                .role(dto.getRole())
                .specialite(dto.getSpecialite())
                .email(dto.getEmail())
                .telephone(dto.getTelephone())
                .statut(dto.getStatut() != null && !dto.getStatut().isBlank() ? dto.getStatut() : "Actif")
                .build();

        return mapToDto(membreEquipeRepository.save(membre));
    }

    @Override
    public MembreEquipeDto update(Long id, MembreEquipeDto dto) {
        MembreEquipe membre = membreEquipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Membre introuvable avec l'id : " + id));

        membre.setNomComplet(dto.getNomComplet());
        membre.setRole(dto.getRole());
        membre.setSpecialite(dto.getSpecialite());
        membre.setEmail(dto.getEmail());
        membre.setTelephone(dto.getTelephone());
        membre.setStatut(dto.getStatut());

        return mapToDto(membreEquipeRepository.save(membre));
    }

    @Override
    public void delete(Long id) {
        MembreEquipe membre = membreEquipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Membre introuvable avec l'id : " + id));

        membreEquipeRepository.delete(membre);
    }

    @Override
    public EquipeStatsDto getStats() {
        List<MembreEquipe> membres = membreEquipeRepository.findAll();

        long totalAvocats = membres.stream()
                .filter(m -> m.getRole() != null && m.getRole().toLowerCase().contains("avocat"))
                .count();

        long totalAffairesGerees = affaireRepository.count();

        return EquipeStatsDto.builder()
                .totalMembres(membreEquipeRepository.count())
                .totalAvocats(totalAvocats)
                .totalAffairesGerees(totalAffairesGerees)
                .totalActifs(membreEquipeRepository.countByStatutIgnoreCase("Actif"))
                .build();
    }

    @Override
    public MembreProfilDto getProfil(Long id) {
        MembreEquipe membre = membreEquipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Membre introuvable avec l'id : " + id));

        List<com.cabinetavocat.backend.model.Affaire> affaires = affaireRepository.findByAssigneAIgnoreCase(membre.getNomComplet());
        List<com.cabinetavocat.backend.model.Tache> taches = tacheRepository.findByAssigneAIgnoreCase(membre.getNomComplet());

        return MembreProfilDto.builder()
                .id(membre.getId())
                .nomComplet(membre.getNomComplet())
                .role(membre.getRole())
                .specialite(membre.getSpecialite())
                .email(membre.getEmail())
                .telephone(membre.getTelephone())
                .statut(membre.getStatut())
                .initiales(buildInitiales(membre.getNomComplet()))
                .nombreAffaires(affaires.size())
                .nombreTaches(taches.size())
                .nombreFactures(0)
                .nombreRendezVous(0)
                .affaires(
                        affaires.stream()
                                .map(a -> AffaireMiniDto.builder()
                                        .id(a.getId())
                                        .reference(formatAffaireReference(a.getId(), a.getDateOuverture()))
                                        .titre(a.getTitre())
                                        .statut(a.getStatut())
                                        .priorite(a.getPriorite())
                                        .dateEcheance(a.getDateEcheance() != null ? a.getDateEcheance().toString() : null)
                                        .build())
                                .toList()
                )
                .taches(
                        taches.stream()
                                .map(t -> TacheMiniDto.builder()
                                        .id(t.getId())
                                        .titre(t.getTitre())
                                        .dueDate(t.getDateEcheance() != null ? t.getDateEcheance().toString() : null)
                                        .priority(t.getPriorite() != null ? t.getPriorite().name() : null)
                                        .completed(t.isCompleted())
                                        .build())
                                .toList()
                )
                .build();
    }

    private String formatAffaireReference(Long id, java.time.LocalDate dateOuverture) {
        int year = dateOuverture != null ? dateOuverture.getYear() : java.time.LocalDate.now().getYear();
        long safeId = id != null ? id : 0L;
        return String.format("AFF-%d-%03d", year, safeId);
    }

    private MembreEquipeDto mapToDto(MembreEquipe membre) {
        return MembreEquipeDto.builder()
                .id(membre.getId())
                .nomComplet(membre.getNomComplet())
                .role(membre.getRole())
                .specialite(membre.getSpecialite())
                .nombreAffaires(0)
                .email(membre.getEmail())
                .telephone(membre.getTelephone())
                .statut(membre.getStatut())
                .initiales(buildInitiales(membre.getNomComplet()))
                .build();
    }

    private String buildInitiales(String nomComplet) {
        if (nomComplet == null || nomComplet.isBlank()) {
            return "--";
        }

        String[] parts = nomComplet.trim().split("\\s+");
        if (parts.length == 1) {
            return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase();
        }

        String first = parts[parts.length - 2].substring(0, 1).toUpperCase();
        String second = parts[parts.length - 1].substring(0, 1).toUpperCase();
        return first + second;
    }
}