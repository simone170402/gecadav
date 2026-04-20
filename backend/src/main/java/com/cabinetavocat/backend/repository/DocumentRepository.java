package com.cabinetavocat.backend.repository;

import com.cabinetavocat.backend.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    long countByCategorieIgnoreCase(String categorie);
}