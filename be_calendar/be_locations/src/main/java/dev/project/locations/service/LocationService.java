package dev.project.locations.service;

import dev.project.locations.model.Location;
import dev.project.locations.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocationService {
    @Autowired
    private LocationRepository locationRepository;

    public Location addLocation(Location location) {
        return locationRepository.save(location);
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Location getLocationById(String id) {
        Optional<Location> location = locationRepository.findById(id);
        return location.orElse(null);
    }

    public Location updateLocation(String id, Location locationDetails) {
        Optional<Location> optionalLocation = locationRepository.findById(id);

        if (optionalLocation.isPresent()) {
            Location location = optionalLocation.get();
            location.setBuilding(locationDetails.getBuilding());
            location.setRoom(locationDetails.getRoom());
            location.setAddress(locationDetails.getAddress());
            return locationRepository.save(location);
        }

        return null;
    }

    public void deleteLocation(String id) {
        locationRepository.deleteById(id);
    }
}
