package dev.project.calendar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
public class CalendarApplication {

	public static void main(String[] args) {
		SpringApplication.run(CalendarApplication.class, args);
	}

	@Bean
	@CrossOrigin(origins = "http://localhost:3000")
	public RouteLocator routerBuilder(RouteLocatorBuilder routeLocatorBuilder){
		return routeLocatorBuilder.routes()
				.route("envents",r->r.path("/api/events/**")
						.uri("http://localhost:8081/"))
				.route("users",r->r.path("/api/members/**")
						.uri("http://localhost:8082/"))
				.route("users",r->r.path("/api/trainers/**")
						.uri("http://localhost:8082/"))
				.route("users",r->r.path("/api/gym-management/**")
						.uri("http://localhost:8082/"))
				.route("locations",r->r.path("/api/locations/**")
						.uri("http://localhost:8083/"))
				.route("subscriptions",r->r.path("/api/subscriptions/**")
						.uri("http://localhost:8084/")).build();
	}
}
