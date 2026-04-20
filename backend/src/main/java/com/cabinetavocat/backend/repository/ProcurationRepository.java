package com.cabinetavocat.backend.repository;

import com.cabinetavocat.backend.model.Procuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcurationRepository extends JpaRepository<Procuration, Long> {

    long countByStatusIgnoreCase(String status);
}
