package dev.calendarapp.users.repository;

import dev.calendarapp.users.model.Trainer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TrainerRepository extends MongoRepository<Trainer, String> {
    Trainer findByEmail(String email);

    Trainer findUserById(String id);
}
