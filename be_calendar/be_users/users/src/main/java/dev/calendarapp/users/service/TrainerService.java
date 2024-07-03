package dev.calendarapp.users.service;

import dev.calendarapp.users.model.Trainer;
import dev.calendarapp.users.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TrainerService {
    @Autowired
    private TrainerRepository trainerRepository;

    public Trainer createTrainer(Trainer trainer) {
        return trainerRepository.save(trainer);
    }

    public Trainer findByEmail(String email) {
        return trainerRepository.findByEmail(email);
    }

    public String getEmailById(String id) {
        return trainerRepository.findById(id).get().getEmail();
    }

    public List<Trainer> allTrainers() {
        return trainerRepository.findAll();
    }

    public Optional<Trainer> findById(String id) {return trainerRepository.findById(id);}

    public void deleteById(String id) {
        trainerRepository.deleteById(id);
    }

    public static List<String> removeDuplicates(List<String> list) {
        Set<String> set = new HashSet<>(list);
        return new ArrayList<>(set);
    }
    public Trainer updateTrainer(String id, Trainer trainer) {
        Trainer updatedTrainer = trainerRepository.findUserById(id);

        updatedTrainer.setEmail(trainer.getEmail());
        updatedTrainer.setName(trainer.getName());
        updatedTrainer.setPassword(trainer.getPassword());

        updatedTrainer.setSkills(new ArrayList<>());
        updatedTrainer.setSkills(removeDuplicates(trainer.getSkills()));

        return trainerRepository.save(updatedTrainer);
    }
}
