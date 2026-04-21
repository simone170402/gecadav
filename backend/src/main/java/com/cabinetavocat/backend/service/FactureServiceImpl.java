package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.FactureDto;
import com.cabinetavocat.backend.auth.dto.FactureStatsDto;
import com.cabinetavocat.backend.model.Affaire;
import com.cabinetavocat.backend.model.Client;
import com.cabinetavocat.backend.model.Facture;
import com.cabinetavocat.backend.model.FactureStatut;
import com.cabinetavocat.backend.repository.AffaireRepository;
import com.cabinetavocat.backend.repository.ClientRepository;
import com.cabinetavocat.backend.repository.FactureRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.util.List;

@Service
public class FactureServiceImpl implements FactureService {

    private final FactureRepository factureRepository;
    private final ClientRepository clientRepository;
    private final AffaireRepository affaireRepository;

    public FactureServiceImpl(
            FactureRepository factureRepository,
            ClientRepository clientRepository,
            AffaireRepository affaireRepository
    ) {
        this.factureRepository = factureRepository;
        this.clientRepository = clientRepository;
        this.affaireRepository = affaireRepository;
    }

    @Override
    public List<FactureDto> getAllFactures() {
        List<Facture> factures = factureRepository.findTop20ByOrderByDateEmissionDesc();
        factures.forEach(this::refreshStatusIfOverdue);

        return factureRepository.findTop20ByOrderByDateEmissionDesc()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public FactureDto getFactureById(Long id) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable avec l'id : " + id));

        refreshStatusIfOverdue(facture);
        return mapToDto(factureRepository.findById(id).orElseThrow());
    }

    @Override
    public FactureDto createFacture(FactureDto factureDto) {
        Client client = clientRepository.findById(factureDto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client introuvable avec l'id : " + factureDto.getClientId()));

        Affaire affaire = null;
        if (factureDto.getAffaireId() != null) {
            affaire = affaireRepository.findById(factureDto.getAffaireId())
                    .orElseThrow(() -> new RuntimeException("Affaire introuvable avec l'id : " + factureDto.getAffaireId()));
        }

        Facture facture = Facture.builder()
                .reference(
                        factureDto.getReference() != null && !factureDto.getReference().isBlank()
                                ? factureDto.getReference()
                                : generateReference()
                )
                .montant(factureDto.getMontant())
                .dateEmission(
                        factureDto.getDateEmission() != null && !factureDto.getDateEmission().isBlank()
                                ? LocalDate.parse(factureDto.getDateEmission())
                                : LocalDate.now()
                )
                .dateEcheance(
                        factureDto.getDateEcheance() != null && !factureDto.getDateEcheance().isBlank()
                                ? LocalDate.parse(factureDto.getDateEcheance())
                                : null
                )
                .statut(
                        factureDto.getStatut() != null && !factureDto.getStatut().isBlank()
                                ? FactureStatut.valueOf(factureDto.getStatut())
                                : FactureStatut.EN_ATTENTE
                )
                .description(factureDto.getDescription())
                .modePaiement(factureDto.getModePaiement())
                .client(client)
                .affaire(affaire)
                .build();

        Facture saved = factureRepository.save(facture);
        refreshStatusIfOverdue(saved);

        return mapToDto(saved);
    }

    @Override
    public FactureDto updateFacture(Long id, FactureDto factureDto) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable avec l'id : " + id));

        Client client = clientRepository.findById(factureDto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client introuvable avec l'id : " + factureDto.getClientId()));

        Affaire affaire = null;
        if (factureDto.getAffaireId() != null) {
            affaire = affaireRepository.findById(factureDto.getAffaireId())
                    .orElseThrow(() -> new RuntimeException("Affaire introuvable avec l'id : " + factureDto.getAffaireId()));
        }

        facture.setReference(factureDto.getReference());
        facture.setMontant(factureDto.getMontant());
        facture.setDateEmission(LocalDate.parse(factureDto.getDateEmission()));
        facture.setDateEcheance(
                factureDto.getDateEcheance() != null && !factureDto.getDateEcheance().isBlank()
                        ? LocalDate.parse(factureDto.getDateEcheance())
                        : null
        );
        facture.setStatut(FactureStatut.valueOf(factureDto.getStatut()));
        facture.setDescription(factureDto.getDescription());
        facture.setModePaiement(factureDto.getModePaiement());
        facture.setClient(client);
        facture.setAffaire(affaire);

        Facture updated = factureRepository.save(facture);
        refreshStatusIfOverdue(updated);

        return mapToDto(updated);
    }

    @Override
    public void deleteFacture(Long id) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable avec l'id : " + id));

        factureRepository.delete(facture);
    }

    @Override
    public FactureStatsDto getFactureStats() {
        List<Facture> factures = factureRepository.findAll();
        factures.forEach(this::refreshStatusIfOverdue);

        BigDecimal revenusTotaux = factureRepository.findAll().stream()
                .filter(f -> f.getStatut() == FactureStatut.PAYEE)
                .map(Facture::getMontant)
                .filter(m -> m != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return FactureStatsDto.builder()
                .revenusTotaux(formatMoney(revenusTotaux))
                .facturesPayees(factureRepository.countByStatut(FactureStatut.PAYEE))
                .enAttente(factureRepository.countByStatut(FactureStatut.EN_ATTENTE))
                .enRetard(factureRepository.countByStatut(FactureStatut.EN_RETARD))
                .build();
    }

    private void refreshStatusIfOverdue(Facture facture) {
        if (facture.getStatut() == FactureStatut.PAYEE || facture.getStatut() == FactureStatut.ANNULEE) {
            return;
        }

        if (facture.getDateEcheance() != null && facture.getDateEcheance().isBefore(LocalDate.now())) {
            if (facture.getStatut() != FactureStatut.EN_RETARD) {
                facture.setStatut(FactureStatut.EN_RETARD);
                factureRepository.save(facture);
            }
        }
    }

    private FactureDto mapToDto(Facture facture) {
        String clientNomComplet = "";
        if (facture.getClient() != null) {
            clientNomComplet = (facture.getClient().getPrenom() + " " + facture.getClient().getNom()).trim();
        }

        String affaireReference = null;
        if (facture.getAffaire() != null) {
            int year = facture.getAffaire().getDateOuverture() != null
                    ? facture.getAffaire().getDateOuverture().getYear()
                    : LocalDate.now().getYear();
            affaireReference = String.format("AFF-%d-%03d", year, facture.getAffaire().getId());
        }

        return FactureDto.builder()
                .id(facture.getId())
                .reference(facture.getReference())
                .montant(facture.getMontant())
                .montantFormate(formatMoney(facture.getMontant()))
                .dateEmission(facture.getDateEmission() != null ? facture.getDateEmission().toString() : null)
                .dateEcheance(facture.getDateEcheance() != null ? facture.getDateEcheance().toString() : null)
                .statut(facture.getStatut().name())
                .description(facture.getDescription())
                .modePaiement(facture.getModePaiement())
                .clientId(facture.getClient() != null ? facture.getClient().getId() : null)
                .clientNomComplet(clientNomComplet)
                .affaireId(facture.getAffaire() != null ? facture.getAffaire().getId() : null)
                .affaireReference(affaireReference)
                .build();
    }

    private String generateReference() {
        long next = factureRepository.count() + 1;
        int year = LocalDate.now().getYear();
        return String.format("FACT-%d-%03d", year, next);
    }

    private String formatMoney(BigDecimal amount) {
        BigDecimal safe = amount != null ? amount : BigDecimal.ZERO;
        DecimalFormat format = new DecimalFormat("#,##0.00");
        return format.format(safe) + " FCFA";
    }

    @Override
    public Facture getEntityById(Long id) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable avec l'id : " + id));

        refreshStatusIfOverdue(facture);
        return factureRepository.findById(id).orElseThrow();
    }
}