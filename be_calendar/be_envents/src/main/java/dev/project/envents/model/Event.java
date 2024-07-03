package dev.project.envents.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "events")
public class Event {
    @Id
    private String id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String trainerId;
    private List<String> memberIds;
    private String type;

    private String locationId;

    private String eventStatus;

    private Integer maxMembers;

    public Event(String title, String description, LocalDateTime startTime, LocalDateTime endTime, String trainerId, String type, String locationId,Integer maxMembers) {
        this.title = title;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.trainerId = trainerId;
        this.memberIds = new ArrayList<>();
        this.type = type;
        this.locationId = locationId;
        this.eventStatus = "upcoming";
        this.maxMembers = maxMembers;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime start_time) {
        this.startTime = start_time;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime end_time) {
        this.endTime = end_time;
    }

    public String getTrainerId() {
        return trainerId;
    }

    public void setTrainerId(String trainer_id) {
        this.trainerId = trainer_id;
    }


    public List<String> getMemberIds() {
        return memberIds;
    }

    public void setMemberIds(List<String> member_ids) {
        this.memberIds = member_ids;
    }


    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }

    public String getEventStatus() {
        return eventStatus;
    }

    public void setEventStatus(String eventStatus) {
        this.eventStatus = eventStatus;
    }

    public Integer getMaxMembers() {
        return maxMembers;
    }

    public void setMaxMembers(Integer maxMembers) {
        this.maxMembers = maxMembers;
    }
}
