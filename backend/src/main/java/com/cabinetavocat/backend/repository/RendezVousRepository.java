package com.cabinetavocat.backend.repository;

import com.cabinetavocat.backend.model.RendezVous;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {

    long countByDateBetween(LocalDate startDate, LocalDate endDate);

    List<RendezVous> findByDateBetweenOrderByDateAscHeureAsc(LocalDate startDate, LocalDate endDate);

    List<RendezVous> findTop5ByDateGreaterThanEqualOrderByDateAscHeureAsc(LocalDate date);

    List<RendezVous> findByDateGreaterThanEqualOrderByDateAscHeureAsc(LocalDate date);

    long countByAffaireId(Long affaireId);
}