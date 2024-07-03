package dev.calendarapp.users.controller;

import dev.calendarapp.users.model.GymManagement;
import dev.calendarapp.users.model.LoginRequest;
import dev.calendarapp.users.service.GymManagementService;
import dev.calendarapp.users.token.GymManagementToken;
import dev.calendarapp.users.util.Password;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/gym-management")
public class GymManagementController {
    @Autowired
    private GymManagementService gymManagementService;
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody GymManagement gymManagement) {
        String hashedPassword;

        if(!Password.isValidPassword(gymManagement.getPassword())) {
            return ResponseEntity.status(401).body("Password is not valid.");
        } else {
            hashedPassword = Password.hashPassword(gymManagement.getPassword());
        }

        if(gymManagementService.findByEmail(gymManagement.getEmail()) != null) {
            return ResponseEntity.status(401).body("Email already exists.");
        }

        GymManagement newGymManagement = new GymManagement(gymManagement.getEmail(), hashedPassword, gymManagement.getName());
        gymManagementService.createGymManagement(newGymManagement);
        return ResponseEntity.ok("Member created.");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        GymManagement gymManagement = gymManagementService.findByEmail(loginRequest.getEmail());

        if (gymManagement != null && Password.checkPassword(loginRequest.getPassword(), gymManagement.getPassword())) {
            String token = GymManagementToken.generateToken(gymManagement);
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<GymManagement> details(@PathVariable String id) {
        return gymManagementService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteGymManagemt(@PathVariable String id) {
        gymManagementService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateGymManagement(@PathVariable String id, @RequestBody GymManagement gymManagement) {
        try {
            String hashedPassword;

            if(!Password.isValidPassword(gymManagement.getPassword())) {
                return ResponseEntity.status(401).body("Password is not valid.");
            } else {
                hashedPassword = Password.hashPassword(gymManagement.getPassword());
            }

            gymManagement.setPassword(hashedPassword);

            GymManagement updatedGymManagement = gymManagementService.updateGymManagement(id, gymManagement);
            return ResponseEntity.status(HttpStatus.OK).body("User updated.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
