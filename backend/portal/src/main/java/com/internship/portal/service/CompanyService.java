package com.internship.portal.service;

import com.internship.portal.config.JwtUtil;
import com.internship.portal.dto.*;
import com.internship.portal.model.Company;
import com.internship.portal.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (companyRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        Company company = new Company();
        company.setName(request.getName());
        company.setEmail(request.getEmail());
        company.setPassword(passwordEncoder.encode(request.getPassword()));
        companyRepository.save(company);

        String token = jwtUtil.generateToken(company.getEmail());
        return new AuthResponse(token, company.getName(), company.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        Company company = companyRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), company.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(company.getEmail());
        return new AuthResponse(token, company.getName(), company.getEmail());
    }

    public Company getByEmail(String email) {
        return companyRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Company not found"));
    }
    public Company updateProfile(String email, Company updated) {
        Company company = getByEmail(email);
        company.setName(updated.getName());
        company.setIndustry(updated.getIndustry());
        company.setWebsite(updated.getWebsite());
        return companyRepository.save(company);
    }
}