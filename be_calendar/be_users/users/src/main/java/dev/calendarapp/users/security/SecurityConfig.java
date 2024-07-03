package dev.calendarapp.users.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers(HttpMethod.GET, "api/members/all").hasAnyAuthority("GYMMANAGEMENT", "TRAINER", "MEMBER")
                                .requestMatchers(HttpMethod.GET, "api/trainers/all").hasAnyAuthority("GYMMANAGEMENT", "TRAINER", "MEMBER")
                                .requestMatchers(HttpMethod.GET, "api/members/{id}").hasAnyAuthority("GYMMANAGEMENT", "TRAINER", "MEMBER")
                                .requestMatchers(HttpMethod.GET, "api/trainers/{id}").hasAnyAuthority("GYMMANAGEMENT", "TRAINER", "MEMBER")
                                .requestMatchers(HttpMethod.DELETE, "api/gym-management/delete/{id}").hasAuthority("GYMMANAGEMENT")
                                .requestMatchers(HttpMethod.PUT, "api/gym-management/update/{id}").hasAuthority("GYMMANAGEMENT")
                                .requestMatchers(HttpMethod.GET, "api/gym-management/{id}").hasAuthority("GYMMANAGEMENT")

                                .requestMatchers(HttpMethod.DELETE, "api/trainers/delete/{id}").hasAuthority("TRAINER")
                                .requestMatchers(HttpMethod.PUT, "api/trainers/update/{id}").hasAuthority("TRAINER")

                                .requestMatchers(HttpMethod.DELETE, "api/members/delete/{id}").hasAuthority("MEMBER")
                                .requestMatchers(HttpMethod.PUT, "api/members/update/{id}").hasAuthority("MEMBER")

                                .requestMatchers("api/members/register", "api/members/login").permitAll()
                                .requestMatchers("api/trainers/register", "api/trainers/login").permitAll()
                                .requestMatchers("api/gym-management/register", "api/gym-management/login").permitAll()
                                .requestMatchers("/sendEmail").permitAll()
                                .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}


