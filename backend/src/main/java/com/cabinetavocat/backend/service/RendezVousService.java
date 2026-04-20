package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.RendezVousDto;

import java.util.List;

<<<<<<< HEAD
public class RendezVousService {

    private final RendezVousRepository repository;

    public RendezVousService(RendezVousRepository repository) {
        this.repository = repository;
    }

    public List<RendezVous> getAll() {
        return repository.findAll();
    }

    public RendezVous create(RendezVous rdv) {
        return repository.save(rdv);
    }

    public RendezVous update(Long id, RendezVous rdv) {
        rdv.setId(id);
        return repository.save(rdv);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
=======
public interface RendezVousService {
    List<RendezVousDto> getAllRendezVous();
    List<RendezVousDto> getUpcomingRendezVous();
    RendezVousDto createRendezVous(RendezVousDto dto);
    void deleteRendezVous(Long id);
>>>>>>> main
}