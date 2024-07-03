package dev.calendarapp.users.controller;

import dev.calendarapp.users.model.LoginRequest;
import dev.calendarapp.users.model.Member;
import dev.calendarapp.users.service.MemberService;
import dev.calendarapp.users.token.MemberToken;
import dev.calendarapp.users.util.Password;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {
    @Autowired
    private MemberService memberService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Member member) {
        String hashedPassword;

        if(!Password.isValidPassword(member.getPassword())) {
            return ResponseEntity.status(401).body("Password is not valid.");
        } else {
            hashedPassword = Password.hashPassword(member.getPassword());
        }

        if(memberService.findByEmail(member.getEmail()) != null) {
            return ResponseEntity.status(401).body("Email already exists.");
        }

        Member newMember = new Member(member.getEmail(), hashedPassword, member.getName());
        memberService.createMember(newMember);
        return ResponseEntity.ok("Member created.");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        Member member = memberService.findByEmail(loginRequest.getEmail());

        if (member != null && Password.checkPassword(loginRequest.getPassword(), member.getPassword())) {
            String token = MemberToken.generateToken(member);
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Member>> getAllMembers() {
        return new ResponseEntity<List<Member>>(memberService.allMembers(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getUserById(@PathVariable String id) {
        return memberService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteMember(@PathVariable String id) {
        memberService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateMember(@PathVariable String id, @RequestBody Member member) {
        try {
            String hashedPassword;

            if(!Password.isValidPassword(member.getPassword())) {
                return ResponseEntity.status(401).body("Password is not valid.");
            } else {
                hashedPassword = Password.hashPassword(member.getPassword());
            }

            member.setPassword(hashedPassword);

            Member updatedMember = memberService.updateMember(id, member);
            return ResponseEntity.status(HttpStatus.OK).body("User updated.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
