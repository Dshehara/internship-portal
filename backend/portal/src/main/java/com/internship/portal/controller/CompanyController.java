package com.internship.portal.controller;

import com.internship.portal.config.JwtUtil;
import com.internship.portal.model.Company;
import com.internship.portal.model.Listing;
import com.internship.portal.repository.ListingRepository;
import com.internship.portal.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;
    private final ListingRepository listingRepository;
    private final JwtUtil jwtUtil;

    @GetMapping("/me")
    public ResponseEntity<Company> getMyProfile(
            @RequestHeader("Authorization") String authHeader) {
        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
        return ResponseEntity.ok(companyService.getByEmail(email));
    }

    @PutMapping("/me")
    public ResponseEntity<Company> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Company updated) {
        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
        return ResponseEntity.ok(companyService.updateProfile(email, updated));
    }

    @GetMapping("/my-listings")
    public ResponseEntity<List<Listing>> getMyListings(
            @RequestHeader("Authorization") String authHeader) {
        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
        Company company = companyService.getByEmail(email);
        return ResponseEntity.ok(listingRepository.findByCompanyId(company.getId()));
    }
}