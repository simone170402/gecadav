package com.cabinetavocat.backend.repository;

import com.cabinetavocat.backend.model.UserSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {

    Optional<UserSubscription> findFirstByUserEmailAndActiveTrueOrderByEndDateDesc(String userEmail);

    List<UserSubscription> findByUserEmailOrderByStartDateDesc(String userEmail);
}