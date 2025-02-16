package dev.calendar.subscriptions.repository;

import dev.calendar.subscriptions.model.Subscription;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionRepository extends MongoRepository<Subscription, String> {
    Subscription findByMemberId (String memberId);
}

