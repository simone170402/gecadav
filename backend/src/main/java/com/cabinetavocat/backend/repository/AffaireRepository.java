package com.cabinetavocat.backend.repository;

import com.cabinetavocat.backend.model.Affaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
@Repository
public interface AffaireRepository extends JpaRepository<Affaire, Long> {

    long countByStatutIgnoreCase(String statut);

    long countByPrioriteIgnoreCase(String priorite);

    List<Affaire> findByAssigneAIgnoreCase(String assigneA);

    List<Affaire> findTop3ByOrderByDateOuvertureDesc();

    long countByDateOuvertureBetween(LocalDate start, LocalDate end);
}
