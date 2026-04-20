package com.cabinetavocat.backend.repository;

import com.cabinetavocat.backend.model.Tache;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface TacheRepository extends JpaRepository<Tache, Long> {
    List<Tache> findByAssigneAIgnoreCase(String assigneA);
}