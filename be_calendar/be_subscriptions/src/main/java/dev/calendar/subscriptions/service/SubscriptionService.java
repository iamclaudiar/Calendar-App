package dev.calendar.subscriptions.service;

import dev.calendar.subscriptions.model.Subscription;
import dev.calendar.subscriptions.model.SubscriptionRequest;
import dev.calendar.subscriptions.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    public Optional<Subscription> getSubscriptionById(String id) {
        return subscriptionRepository.findById(id);
    }

    public Subscription getSubscriptionByMemberId(String memberId) {
        if((subscriptionRepository.findByMemberId(memberId) != null)) {
            return subscriptionRepository.findByMemberId(memberId);
        }
        return null;
    }

    public Subscription createSubscription(SubscriptionRequest subscription_request) {
        LocalDateTime now = LocalDateTime.now();

        if ((subscriptionRepository.findByMemberId(subscription_request.getMemberId()) == null)) {
            Subscription subscription = new Subscription();
            subscription.setCreatedDate(LocalDateTime.now());
            subscription.setExpirationDate(subscription.getCreatedDate().plusDays(subscription_request.getDays()));
            subscription.setSubscriptionType(subscription_request.getSubscriptionType());
            subscription.setMemberId(subscription_request.getMemberId());
            return subscriptionRepository.save(subscription);
        } else {
            return null;
        }
    }

    public void deleteSubscription(String id) {
        subscriptionRepository.deleteById(id);
    }

    @Scheduled(cron = "0 * * * * *")  // Rulează din minut in minut
    public void updateAvtiveSubscriptions() {
        List<Subscription> subscriptions = subscriptionRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (Subscription subscription : subscriptions) {
            if (subscription.getExpirationDate().isBefore(now)) {
                subscriptionRepository.deleteById(subscription.getId());
            }
        }
    }
}

