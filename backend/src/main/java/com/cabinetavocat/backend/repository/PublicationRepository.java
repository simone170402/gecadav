package com.cabinetavocat.backend.repository;

import com.cabinetavocat.backend.model.Publication;
import com.cabinetavocat.backend.model.PublicationStatus;
import com.cabinetavocat.backend.model.PublicationType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PublicationRepository extends JpaRepository<Publication, Long> {

    Optional<Publication> findBySlug(String slug);

    Optional<Publication> findBySlugAndStatus(String slug, PublicationStatus status);

    List<Publication> findByTypeAndStatusOrderByPublishedAtDesc(
            PublicationType type,
            PublicationStatus status
    );

    List<Publication> findByTypeAndStatusAndFeaturedTrueOrderByPublishedAtDesc(
            PublicationType type,
            PublicationStatus status,
            Pageable pageable
    );

    List<Publication> findByTypeAndStatusAndCategoryIgnoreCaseOrderByPublishedAtDesc(
            PublicationType type,
            PublicationStatus status,
            String category
    );
}
