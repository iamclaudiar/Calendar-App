package dev.calendarapp.users.service;

import dev.calendarapp.users.model.GymManagement;
import dev.calendarapp.users.repository.GymManagementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GymManagementService {
    @Autowired
    private GymManagementRepository gymManagementRepository;

    public GymManagement createGymManagement(GymManagement gymManagement) {
        return gymManagementRepository.save(gymManagement);
    }

    public GymManagement findByEmail(String email) {
        return gymManagementRepository.findByEmail(email);
    }

    public Optional<GymManagement> findById(String id) {
        return gymManagementRepository.findById(id);
    }

    public void deleteById(String id) {
        gymManagementRepository.deleteById(id);
    }

    public GymManagement updateGymManagement(String id, GymManagement gymManagement) {
        GymManagement updatedGymManagent = gymManagementRepository.findUserById(id);

        updatedGymManagent.setEmail(gymManagement.getEmail());
        updatedGymManagent.setName(gymManagement.getName());
        updatedGymManagent.setPassword(gymManagement.getPassword());

        return gymManagementRepository.save(updatedGymManagent);
    }
}
