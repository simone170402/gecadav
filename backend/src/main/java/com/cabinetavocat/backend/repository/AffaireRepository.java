package com.cabinetavocat.backend.repository;

import com.cabinetavocat.backend.model.Affaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AffaireRepository extends JpaRepository<Affaire, Long> {
}
