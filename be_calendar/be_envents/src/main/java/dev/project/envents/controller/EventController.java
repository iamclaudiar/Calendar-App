package dev.project.envents.controller;

import dev.project.envents.model.Event;
import dev.project.envents.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class EventController {
    @Autowired
    private EventService eventService;

    @GetMapping("/all")
    public ResponseEntity<List<Event>> getAllEvents() {
        return new ResponseEntity<List<Event>>(eventService.allEvents(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable String eventId) {
        Optional<Event> event = eventService.getEventById(eventId);
        if (event.isPresent()) {
            return ResponseEntity.ok(event.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Event> addEvent(@RequestBody Event event) {
        Event savedEvent = eventService.addEvent(event);
        return new ResponseEntity<>(savedEvent, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable String id) {
        eventService.deleteEventById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable String id, @RequestBody Event event) {
        try {
            Event updatedEvent = eventService.updateEvent(id, event);
            return new ResponseEntity<>(updatedEvent, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/addMember/{id}")
    public ResponseEntity<Event> addMemberToEvent(@PathVariable String id, @RequestParam String memberId) {
        try {
            Event updatedEvent = eventService.addMemberToEvent(id, memberId);
            return ResponseEntity.ok(updatedEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/deleteMember/{id}")
    public ResponseEntity<Event> deleteMemberFromEvent(@PathVariable String id, @RequestParam String memberId) {
        try {
            Event updatedEvent = eventService.deleteMemberFromEvent(id, memberId);
            return ResponseEntity.ok(updatedEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/member/{memberId}")
    public List<Event> getEventsForMember(@PathVariable String memberId) {
        return eventService.getEventsForMember(memberId);
    }

    @GetMapping("/trainer/{trainerId}")
    public List<Event> getEventsForTrainer(@PathVariable String trainerId) {
        return eventService.getEventsForTrainer(trainerId);
    }

    @GetMapping("/count/{memberId}")
    public long countEventsForMemberToday(@PathVariable String memberId, @RequestParam LocalDate localDate) {
        return eventService.countEventsForMemberDay(memberId, localDate);
    }
}
