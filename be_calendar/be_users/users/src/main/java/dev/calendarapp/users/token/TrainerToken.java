package dev.calendarapp.users.token;

import dev.calendarapp.users.model.Trainer;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Calendar;
public class TrainerToken {
    private static final String SECRET = "secretkeyssecretkeyssecretkeyssecretkeyssecretkeyssecretkeys";
    public static String generateToken(Trainer user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        claims.put("id", user.getId());
        claims.put("name", user.getName());
        claims.put("role", "TRAINER");

        Date currentDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        Date expirationDate = calendar.getTime();

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(currentDate)
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS256, SECRET)
                .compact();
    }
}

