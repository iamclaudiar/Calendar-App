package dev.calendarapp.users.controller;

import dev.calendarapp.users.model.LoginRequest;
import dev.calendarapp.users.model.Trainer;
import dev.calendarapp.users.service.TrainerService;
import dev.calendarapp.users.token.TrainerToken;
import dev.calendarapp.users.util.Password;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainers")
public class TrainerController {
    @Autowired
    private TrainerService trainerService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Trainer trainer) {
        String hashedPassword;

        if(!Password.isValidPassword(trainer.getPassword())) {
            return ResponseEntity.status(401).body("Password is not valid.");
        } else {
            hashedPassword = Password.hashPassword(trainer.getPassword());
        }

        if(trainerService.findByEmail(trainer.getEmail()) != null) {
            return ResponseEntity.status(401).body("Email already exists.");
        }

        Trainer newTrainer = new Trainer(trainer.getEmail(), hashedPassword, trainer.getName(), trainer.getSkills());
        trainerService.createTrainer(newTrainer);
        return ResponseEntity.ok("Trainer created.");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        Trainer trainer = trainerService.findByEmail(loginRequest.getEmail());

        if (trainer != null && Password.checkPassword(loginRequest.getPassword(), trainer.getPassword())) {
            String token = TrainerToken.generateToken(trainer);
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Trainer>> getAllTrainers() {
        return new ResponseEntity<List<Trainer>>(trainerService.allTrainers(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trainer> getUserById(@PathVariable String id) {
        return trainerService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTrainer(@PathVariable String id) {
        trainerService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateTrainer(@PathVariable String id, @RequestBody Trainer trainer) {
        try {
            String hashedPassword;

            if(!Password.isValidPassword(trainer.getPassword())) {
                return ResponseEntity.status(401).body("Password is not valid.");
            } else {
                hashedPassword = Password.hashPassword(trainer.getPassword());
            }

            trainer.setPassword(hashedPassword);

            Trainer updatedTrainer = trainerService.updateTrainer(id, trainer);
            return ResponseEntity.status(HttpStatus.OK).body("User updated.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
