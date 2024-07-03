package dev.calendar.subscriptions.controller;

import dev.calendar.subscriptions.model.Subscription;
import dev.calendar.subscriptions.model.SubscriptionRequest;
import dev.calendar.subscriptions.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @GetMapping("/all")
    public List<Subscription> getAllSubscriptions() {
        return subscriptionService.getAllSubscriptions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subscription> getSubscriptionById(@PathVariable String id) {
        return subscriptionService.getSubscriptionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/member/{id}")
    public Subscription getSubscriptionByMemberId(@PathVariable String id) {
        return subscriptionService.getSubscriptionByMemberId(id);
    }

    @PostMapping
    public Subscription createSubscription(@RequestBody SubscriptionRequest subscription_request) {
        return subscriptionService.createSubscription(subscription_request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable String id) {
        subscriptionService.deleteSubscription(id);
        return ResponseEntity.noContent().build();
    }
}

