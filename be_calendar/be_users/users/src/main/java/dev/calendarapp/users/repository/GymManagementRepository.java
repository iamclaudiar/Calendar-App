package dev.calendarapp.users.repository;

import dev.calendarapp.users.model.GymManagement;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GymManagementRepository extends MongoRepository<GymManagement, String> {
    GymManagement findByEmail(String email);
    GymManagement findUserById(String id);
}
