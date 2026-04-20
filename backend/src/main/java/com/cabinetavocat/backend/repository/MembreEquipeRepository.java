package com.cabinetavocat.backend.repository;

import com.cabinetavocat.backend.model.MembreEquipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MembreEquipeRepository extends JpaRepository<MembreEquipe, Long> {

    long countByStatutIgnoreCase(String statut);
}
