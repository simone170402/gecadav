package com.cabinetavocat.backend.repository;

import com.cabinetavocat.backend.model.Facture;
import com.cabinetavocat.backend.model.FactureStatut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {

    List<Facture> findTop20ByOrderByDateEmissionDesc();

    List<Facture> findByDateEmissionBetween(LocalDate startDate, LocalDate endDate);

    long countByStatut(FactureStatut statut);
}