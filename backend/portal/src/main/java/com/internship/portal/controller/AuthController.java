package com.internship.portal.controller;

import com.internship.portal.dto.*;
import com.internship.portal.service.CompanyService;
import com.internship.portal.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final StudentService studentService;
    private final CompanyService companyService;

    @PostMapping("/student/register")
    public ResponseEntity<AuthResponse> studentRegister(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(studentService.register(request));
    }

    @PostMapping("/student/login")
    public ResponseEntity<AuthResponse> studentLogin(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(studentService.login(request));
    }

    @PostMapping("/company/register")
    public ResponseEntity<AuthResponse> companyRegister(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(companyService.register(request));
    }

    @PostMapping("/company/login")
    public ResponseEntity<AuthResponse> companyLogin(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(companyService.login(request));
    }
}