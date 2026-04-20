package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.TacheDto;
import com.cabinetavocat.backend.model.Tache;
import com.cabinetavocat.backend.repository.TacheRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TacheServiceImpl implements TacheService {

    private final TacheRepository repository;

    public TacheServiceImpl(TacheRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<TacheDto> getAll() {
        return repository.findAll().stream().map(this::mapToDto).toList();
    }

    @Override
    public TacheDto create(TacheDto dto) {
        Tache tache = Tache.builder()
                .titre(dto.getTitre())
                .dateEcheance(LocalDate.parse(dto.getDueDate()))
                .priorite(Tache.Priorite.valueOf(dto.getPriority()))
                .completed(false)
                .assigneA(dto.getAssignedTo())
                .build();

        return mapToDto(repository.save(tache));
    }

    @Override
    public TacheDto toggle(Long id) {
        Tache tache = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tâche introuvable"));

        tache.setCompleted(!tache.isCompleted());
        return mapToDto(repository.save(tache));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private TacheDto mapToDto(Tache t) {
        return TacheDto.builder()
                .id(t.getId())
                .titre(t.getTitre())
                .dueDate(t.getDateEcheance().toString())
                .priority(t.getPriorite().name())
                .completed(t.isCompleted())
                .assignedTo(t.getAssigneA())
                .build();
    }
}