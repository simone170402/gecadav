package com.cabinetavocat.backend.repository;

import com.cabinetavocat.backend.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    long countByStatutIgnoreCase(String statut);

    long countByTypeIgnoreCase(String type);
}