package dev.calendarapp.users.service;

import dev.calendarapp.users.model.GymManagement;
import dev.calendarapp.users.model.Member;
import dev.calendarapp.users.model.Trainer;
import dev.calendarapp.users.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MemberService {
    @Autowired
    private MemberRepository memberRepository;

    public Member createMember(Member member) {
        return memberRepository.save(member);
    }

    public Member findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }

    public Optional<Member> findById(String id) {return memberRepository.findById(id);}

    public List<Member> allMembers() {
        return memberRepository.findAll();
    }

    public void deleteById(String id) {
        memberRepository.deleteById(id);
    }

    public Member updateMember(String id, Member member) {
        Member updatedMember = memberRepository.findUserById(id);

        updatedMember.setEmail(member.getEmail());
        updatedMember.setName(member.getName());
        updatedMember.setPassword(member.getPassword());

        return memberRepository.save(updatedMember);
    }
}
