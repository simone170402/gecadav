package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.*;
import com.cabinetavocat.backend.model.Affaire;
import com.cabinetavocat.backend.model.Client;
import com.cabinetavocat.backend.model.Facture;
import com.cabinetavocat.backend.model.RendezVous;
import com.cabinetavocat.backend.repository.AffaireRepository;
import com.cabinetavocat.backend.repository.ClientRepository;
import com.cabinetavocat.backend.repository.FactureRepository;
import com.cabinetavocat.backend.repository.RendezVousRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ClientRepository clientRepository;
    private final AffaireRepository affaireRepository;
    private final RendezVousRepository rendezVousRepository;
    private final FactureRepository factureRepository;

    public DashboardServiceImpl(
            ClientRepository clientRepository,
            AffaireRepository affaireRepository,
            RendezVousRepository rendezVousRepository,
            FactureRepository factureRepository
    ) {
        this.clientRepository = clientRepository;
        this.affaireRepository = affaireRepository;
        this.rendezVousRepository = rendezVousRepository;
        this.factureRepository = factureRepository;
    }

    @Override
    public DashboardResponseDto getDashboardData() {
        LocalDate today = LocalDate.now();
        LocalDate firstDayOfMonth = today.withDayOfMonth(1);

        long totalClients = clientRepository.count();
        long totalAffairesEnCours = affaireRepository.countByStatutIgnoreCase("En cours");
        long totalRendezVousMois = rendezVousRepository.countByDateBetween(firstDayOfMonth, today);

        BigDecimal revenuMois = factureRepository.findByDateEmissionBetween(firstDayOfMonth, today)
                .stream()
                .map(Facture::getMontant)
                .filter(montant -> montant != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<DashboardStatItemDto> stats = List.of(
                DashboardStatItemDto.builder()
                        .label("Clients actifs")
                        .value(String.valueOf(totalClients))
                        .change("+0%")
                        .trend("up")
                        .icon("users")
                        .color("blue")
                        .build(),
                DashboardStatItemDto.builder()
                        .label("Affaires en cours")
                        .value(String.valueOf(totalAffairesEnCours))
                        .change("+0%")
                        .trend("up")
                        .icon("briefcase")
                        .color("purple")
                        .build(),
                DashboardStatItemDto.builder()
                        .label("Rendez-vous ce mois")
                        .value(String.valueOf(totalRendezVousMois))
                        .change("+0%")
                        .trend("up")
                        .icon("calendar")
                        .color("green")
                        .build(),
                DashboardStatItemDto.builder()
                        .label("Revenus du mois")
                        .value(revenuMois.toPlainString() + " FCFA")
                        .change("+0%")
                        .trend("up")
                        .icon("dollar")
                        .color("gold")
                        .build()
        );

        List<RecentCaseDto> recentCases = affaireRepository.findTop3ByOrderByDateOuvertureDesc()
                .stream()
                .map(this::mapAffaireToRecentCase)
                .toList();

        List<UpcomingAppointmentDto> upcomingAppointments = rendezVousRepository
                .findTop5ByDateGreaterThanEqualOrderByDateAscHeureAsc(today)
                .stream()
                .map(this::mapRendezVousToUpcomingAppointment)
                .toList();

        List<MonthlyActivityDto> monthlyActivity = buildMonthlyActivity(today);
        List<RevenueDataDto> revenueData = buildRevenueData(today);

        return DashboardResponseDto.builder()
                .stats(stats)
                .recentCases(recentCases)
                .upcomingAppointments(upcomingAppointments)
                .monthlyActivity(monthlyActivity)
                .revenueData(revenueData)
                .build();
    }

    private RecentCaseDto mapAffaireToRecentCase(Affaire affaire) {
        String clientName = "";
        if (affaire.getClient() != null) {
            Client client = affaire.getClient();
            clientName = (client.getPrenom() + " " + client.getNom()).trim();
        }

        String deadline = affaire.getDateEcheance() != null
                ? affaire.getDateEcheance().toString()
                : "N/A";
            
        return RecentCaseDto.builder()
                .id(formatAffaireReference(affaire))
                .client(clientName)
                .type(affaire.getTitre())
                .status(affaire.getStatut())
                .deadline(deadline)
                .priority(resolvePriority(affaire.getStatut()))
                .build();
    }

    private UpcomingAppointmentDto mapRendezVousToUpcomingAppointment(RendezVous rdv) {
        String clientName = "";
        if (rdv.getClient() != null) {
            clientName = (rdv.getClient().getPrenom() + " " + rdv.getClient().getNom()).trim();
        }

        String type = rdv.getAffaire() != null ? rdv.getAffaire().getTitre() : "Consultation";
        String time = rdv.getHeure() != null ? rdv.getHeure().toString() : "--:--";

        return UpcomingAppointmentDto.builder()
                .time(time)
                .client(clientName)
                .type(type)
                .duration("—")
                .build();
    }

    private List<MonthlyActivityDto> buildMonthlyActivity(LocalDate today) {
        List<MonthlyActivityDto> result = new ArrayList<>();

        for (int i = 3; i >= 0; i--) {
            LocalDate monthDate = today.minusMonths(i);
            LocalDate start = monthDate.withDayOfMonth(1);
            LocalDate end = monthDate.withDayOfMonth(monthDate.lengthOfMonth());

            int affairesCount = (int) affaireRepository.countByDateOuvertureBetween(start, end);

            int clientsCount = (int) clientRepository.findAll().stream()
                    .filter(c -> c.getDateCreation() != null)
                    .filter(c -> {
                        LocalDate createdDate = c.getDateCreation();
                        return !createdDate.isBefore(start) && !createdDate.isAfter(end);
                    })
                    .count();

            result.add(MonthlyActivityDto.builder()
                    .month(getFrenchMonthLabel(monthDate.getMonthValue()))
                    .affaires(affairesCount)
                    .clients(clientsCount)
                    .build());
        }

        return result;
    }

    private List<RevenueDataDto> buildRevenueData(LocalDate today) {
        List<RevenueDataDto> result = new ArrayList<>();

        for (int i = 3; i >= 0; i--) {
            LocalDate monthDate = today.minusMonths(i);
            LocalDate start = monthDate.withDayOfMonth(1);
            LocalDate end = monthDate.withDayOfMonth(monthDate.lengthOfMonth());

            double revenue = factureRepository.findByDateEmissionBetween(start, end)
                    .stream()
                    .map(Facture::getMontant)
                    .filter(montant -> montant != null)
                    .mapToDouble(BigDecimal::doubleValue)
                    .sum();

            result.add(RevenueDataDto.builder()
                    .month(getFrenchMonthLabel(monthDate.getMonthValue()))
                    .revenue(revenue)
                    .build());
        }

        return result;
    }

    private String formatAffaireReference(Affaire affaire) {
        int year = affaire.getDateOuverture() != null
                ? affaire.getDateOuverture().getYear()
                : LocalDate.now().getYear();

        long id = affaire.getId() != null ? affaire.getId() : 0L;
        return String.format("AFF-%d-%03d", year, id);
    }

    private String resolvePriority(String statut) {
        if (statut == null) return "low";

        String normalized = statut.trim().toLowerCase();

        if (normalized.contains("urgent")) return "high";
        if (normalized.contains("audience") || normalized.contains("cours")) return "medium";
        return "low";
    }

    private String getFrenchMonthLabel(int month) {
        return switch (month) {
            case 1 -> "Jan";
            case 2 -> "Fév";
            case 3 -> "Mar";
            case 4 -> "Avr";
            case 5 -> "Mai";
            case 6 -> "Juin";
            case 7 -> "Juil";
            case 8 -> "Aoû";
            case 9 -> "Sep";
            case 10 -> "Oct";
            case 11 -> "Nov";
            case 12 -> "Déc";
            default -> "";
        };
    }
}