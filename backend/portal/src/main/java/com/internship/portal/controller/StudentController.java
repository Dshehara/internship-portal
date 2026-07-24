package com.internship.portal.controller;

import com.internship.portal.config.JwtUtil;
import com.internship.portal.model.Student;
import com.internship.portal.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final JwtUtil jwtUtil;

    @GetMapping("/me")
    public ResponseEntity<Student> getMyProfile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        return ResponseEntity.ok(studentService.getByEmail(email));
    }

    @PutMapping("/me")
    public ResponseEntity<Student> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Student updated) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        return ResponseEntity.ok(studentService.updateProfile(email, updated));
    }
}