package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.*;
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
import java.time.Month;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatistiquesServiceImpl implements StatistiquesService {

    private final FactureRepository factureRepository;
    private final AffaireRepository affaireRepository;
    private final ClientRepository clientRepository;

    public StatistiquesServiceImpl(
            FactureRepository factureRepository,
            AffaireRepository affaireRepository,
            ClientRepository clientRepository
    ) {
        this.factureRepository = factureRepository;
        this.affaireRepository = affaireRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    public StatistiquesDashboardDto getDashboardStatistics() {
        List<Facture> factures = factureRepository.findAll();
        List<Affaire> affaires = affaireRepository.findAll();
        List<Client> clients = clientRepository.findAll();

        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate endOfMonth = now.withDayOfMonth(now.lengthOfMonth());

        BigDecimal revenusCeMois = factures.stream()
                .filter(f -> f.getStatut() == FactureStatut.PAYEE)
                .filter(f -> f.getDateEmission() != null)
                .filter(f -> !f.getDateEmission().isBefore(startOfMonth) && !f.getDateEmission().isAfter(endOfMonth))
                .map(Facture::getMontant)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long nouvellesAffaires = affaires.stream()
                .filter(a -> a.getDateOuverture() != null)
                .filter(a -> !a.getDateOuverture().isBefore(startOfMonth) && !a.getDateOuverture().isAfter(endOfMonth))
                .count();

        long nouveauxClients = clients.stream()
                .filter(c -> c.getDateCreation() != null)
                .filter(c -> !c.getDateCreation().isBefore(startOfMonth) && !c.getDateCreation().isAfter(endOfMonth))
                .count();

        long cloturees = affaires.stream()
                .filter(a -> "Clôturée".equalsIgnoreCase(a.getStatut()))
                .count();

        int tauxSucces = affaires.isEmpty() ? 0 : (int) Math.round((cloturees * 100.0) / affaires.size());

        StatistiquesKpiDto kpis = StatistiquesKpiDto.builder()
                .revenusCeMois(formatMoney(revenusCeMois))
                .nouvellesAffaires(nouvellesAffaires)
                .nouveauxClients(nouveauxClients)
                .tauxSucces(tauxSucces)
                .build();

        List<MonthlyRevenueDto> monthlyRevenue = buildMonthlyRevenue(factures, 7);
        List<CasesByTypeDto> casesByType = buildCasesByType(affaires);
        List<ClientGrowthDto> clientGrowth = buildClientGrowth(clients, 6);

        PerformanceMetricsDto performance = PerformanceMetricsDto.builder()
                .tempsMoyenResolution(calculateAverageResolution(affaires))
                .satisfactionClient(0.0)
                .tauxFidelisation(calculateRetentionRate(affaires))
                .build();

        return StatistiquesDashboardDto.builder()
                .kpis(kpis)
                .monthlyRevenue(monthlyRevenue)
                .casesByType(casesByType)
                .clientGrowth(clientGrowth)
                .performance(performance)
                .build();
    }

    private List<MonthlyRevenueDto> buildMonthlyRevenue(List<Facture> factures, int monthsCount) {
        LocalDate now = LocalDate.now();
        List<MonthlyRevenueDto> result = new ArrayList<>();

        for (int i = monthsCount - 1; i >= 0; i--) {
            LocalDate monthDate = now.minusMonths(i);
            Month month = monthDate.getMonth();
            int year = monthDate.getYear();

            double total = factures.stream()
                    .filter(f -> f.getStatut() == FactureStatut.PAYEE)
                    .filter(f -> f.getDateEmission() != null)
                    .filter(f -> f.getDateEmission().getMonth() == month && f.getDateEmission().getYear() == year)
                    .map(Facture::getMontant)
                    .filter(Objects::nonNull)
                    .mapToDouble(BigDecimal::doubleValue)
                    .sum();

            result.add(MonthlyRevenueDto.builder()
                    .month(shortMonth(month))
                    .revenue(total)
                    .build());
        }

        return result;
    }

    private List<CasesByTypeDto> buildCasesByType(List<Affaire> affaires) {
        Map<String, Long> counts = affaires.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getType() != null && !a.getType().isBlank() ? a.getType() : "Non défini",
                        Collectors.counting()
                ));

        return counts.entrySet().stream()
                .map(entry -> CasesByTypeDto.builder()
                        .name(entry.getKey())
                        .value(entry.getValue())
                        .build())
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .toList();
    }

    private List<ClientGrowthDto> buildClientGrowth(List<Client> clients, int monthsCount) {
        LocalDate now = LocalDate.now();
        List<ClientGrowthDto> result = new ArrayList<>();

        for (int i = monthsCount - 1; i >= 0; i--) {
            LocalDate monthDate = now.minusMonths(i);
            LocalDate endOfMonth = monthDate.withDayOfMonth(monthDate.lengthOfMonth());

            long total = clients.stream()
                    .filter(c -> c.getDateCreation() != null)
                    .filter(c -> !c.getDateCreation().isAfter(endOfMonth))
                    .count();

            result.add(ClientGrowthDto.builder()
                    .month(shortMonth(monthDate.getMonth()))
                    .clients(total)
                    .build());
        }

        return result;
    }

    private double calculateAverageResolution(List<Affaire> affaires) {
        List<Long> resolvedDurations = affaires.stream()
                .filter(a -> a.getDateOuverture() != null && a.getDateCloture() != null)
                .map(a -> ChronoUnit.DAYS.between(a.getDateOuverture(), a.getDateCloture()))
                .filter(days -> days >= 0)
                .toList();

        if (resolvedDurations.isEmpty()) {
            return 0.0;
        }

        double avgDays = resolvedDurations.stream().mapToLong(Long::longValue).average().orElse(0.0);
        return Math.round((avgDays / 30.0) * 10.0) / 10.0;
    }

    private int calculateRetentionRate(List<Affaire> affaires) {
        Map<Long, Long> casesByClient = affaires.stream()
                .filter(a -> a.getClient() != null && a.getClient().getId() != null)
                .collect(Collectors.groupingBy(a -> a.getClient().getId(), Collectors.counting()));

        if (casesByClient.isEmpty()) {
            return 0;
        }

        long returningClients = casesByClient.values().stream()
                .filter(count -> count > 1)
                .count();

        return (int) Math.round((returningClients * 100.0) / casesByClient.size());
    }

    private String shortMonth(Month month) {
        return switch (month) {
            case JANUARY -> "Jan";
            case FEBRUARY -> "Fév";
            case MARCH -> "Mar";
            case APRIL -> "Avr";
            case MAY -> "Mai";
            case JUNE -> "Juin";
            case JULY -> "Juil";
            case AUGUST -> "Août";
            case SEPTEMBER -> "Sep";
            case OCTOBER -> "Oct";
            case NOVEMBER -> "Nov";
            case DECEMBER -> "Déc";
        };
    }

    private String formatMoney(BigDecimal amount) {
        BigDecimal safe = amount != null ? amount : BigDecimal.ZERO;
        DecimalFormat format = new DecimalFormat("#,##0.00");
        return format.format(safe) + " FCFA";
    }
}