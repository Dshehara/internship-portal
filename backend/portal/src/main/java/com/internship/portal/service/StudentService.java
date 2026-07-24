package com.internship.portal.service;

import com.internship.portal.config.JwtUtil;
import com.internship.portal.dto.*;
import com.internship.portal.model.Student;
import com.internship.portal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        Student student = new Student();
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        studentRepository.save(student);

        String token = jwtUtil.generateToken(student.getEmail());
        return new AuthResponse(token, student.getName(), student.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        Student student = studentRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), student.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(student.getEmail());
        return new AuthResponse(token, student.getName(), student.getEmail());
    }

    public Student getByEmail(String email) {
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student updateProfile(String email, Student updated) {
        Student student = getByEmail(email);
        student.setName(updated.getName());
        student.setSkills(updated.getSkills());
        student.setCvLink(updated.getCvLink());
        student.setPhone(updated.getPhone());
        return studentRepository.save(student);
    }
}