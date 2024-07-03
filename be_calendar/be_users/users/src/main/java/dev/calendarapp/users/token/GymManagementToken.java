package dev.calendarapp.users.token;

import dev.calendarapp.users.model.GymManagement;
import dev.calendarapp.users.model.Member;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class GymManagementToken {
        private static final String SECRET = "secretkeyssecretkeyssecretkeyssecretkeyssecretkeyssecretkeys";

        public static String generateToken(GymManagement user) {
            Map<String, Object> claims = new HashMap<>();
            claims.put("email", user.getEmail());
            claims.put("id", user.getId());
            claims.put("name", user.getName());
            claims.put("role", "GYMMANAGEMENT");

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
