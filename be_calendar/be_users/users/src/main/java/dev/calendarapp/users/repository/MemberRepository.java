package dev.calendarapp.users.repository;

import dev.calendarapp.users.model.GymManagement;
import dev.calendarapp.users.model.Member;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MemberRepository extends MongoRepository<Member, String> {
    Member findByEmail(String email);

    Member findUserById(String id);
}
