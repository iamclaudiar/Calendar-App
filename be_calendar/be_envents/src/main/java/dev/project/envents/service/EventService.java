package dev.project.envents.service;

import dev.project.envents.model.Event;
import dev.project.envents.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    public List<Event> allEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(String eventId) {
        return eventRepository.findById(eventId);
    }

    public Event addEvent(Event event) {
        if (event.getEndTime().isBefore(event.getStartTime()))
        {
            throw new RuntimeException("Event end time is before start time");
        }
        if (event.getEndTime().isBefore(LocalDateTime.now()) || event.getStartTime().isBefore(LocalDateTime.now()))
        {
            throw new RuntimeException("Event cannot be set in the past");
        }
        return eventRepository.save(event);
    }

    public void deleteEventById(String id) {
        eventRepository.deleteById(id);
    }

    public Event updateEvent(String id, Event event) {
        if (event.getEndTime().isBefore(event.getStartTime()))
        {
            throw new RuntimeException("Event end time is before start time");
        }
        if (event.getEndTime().isBefore(LocalDateTime.now()) || event.getStartTime().isBefore(LocalDateTime.now()))
        {
            throw new RuntimeException("Event cannot be set in the past");
        }

        Event updatedEvent = eventRepository.findEventById(id);

        updatedEvent.setTitle(event.getTitle());
        updatedEvent.setDescription(event.getDescription());
        updatedEvent.setStartTime(event.getStartTime());
        updatedEvent.setEndTime(event.getEndTime());
        updatedEvent.setType(event.getType());
        updatedEvent.setTrainerId(event.getTrainerId());
        updatedEvent.setLocationId(event.getLocationId());
        updatedEvent.setMaxMembers(event.getMaxMembers());

        return eventRepository.save(updatedEvent);
    }

    public Event addMemberToEvent(String eventId, String memberId) {
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();
                if (!event.getMemberIds().contains(memberId) && (event.getMemberIds().size() < event.getMaxMembers())) {
                    event.getMemberIds().add(memberId);
                    eventRepository.save(event);
                    return event;
                } else {
                    throw new RuntimeException("Event not accept join");
                }
        }
        return null;
    }

    public Event deleteMemberFromEvent(String eventId, String memberId) {
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();

            if (event.getMemberIds().contains(memberId)) {
                event.getMemberIds().remove(memberId);
                eventRepository.save(event);
                return event;
            } else {
                throw new RuntimeException("Membrul nu este asociat cu acest eveniment");
            }
        } else {
            throw new RuntimeException("Evenimentul nu a fost găsit");
        }
    }

    public List<Event> getEventsForMember(String memberId) {
        return eventRepository.findByMemberIdsContaining(memberId);
    }

    public List<Event> getEventsForTrainer(String trainerId) {
        return eventRepository.findByTrainerId(trainerId);
    }

    public long countEventsForMemberDay(String memberId, LocalDate localDate) {
        LocalDateTime startOfDay = LocalDateTime.of(localDate, LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(localDate, LocalTime.MAX);
        List<Event> events = eventRepository.findByMemberIdsContainingAndStartTimeBetween(memberId, startOfDay, endOfDay);
        return events.size();
    }

    @Scheduled(cron = "0 * * * * *")  // Rulează din minut in minut
    public void updateEventStatuses() {
        List<Event> events = eventRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (Event event : events) {
            if (now.isBefore(event.getStartTime())) {
                event.setEventStatus("upcoming");
            } else if (now.isAfter(event.getEndTime())) {
                event.setEventStatus("finished");
            } else {
                event.setEventStatus("ongoing");
            }
            eventRepository.save(event);
        }
    }
}
