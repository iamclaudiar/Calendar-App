package dev.project.envents.repository;

import dev.project.envents.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    Event findEventById(String id);
    List<Event> findByTrainerId(String trainer_id);
    List<Event> findByMemberIdsContaining(String memberId);
    List<Event> findByMemberIdsContainingAndStartTimeBetween(String memberId, LocalDateTime startOfDay, LocalDateTime endOfDay);
}
