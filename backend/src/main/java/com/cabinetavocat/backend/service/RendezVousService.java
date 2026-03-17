package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.model.RendezVous;
import com.cabinetavocat.backend.repository.RendezVousRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
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
}