package com.internship.portal.controller;

import com.internship.portal.config.JwtUtil;
import com.internship.portal.model.Application;
import com.internship.portal.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final JwtUtil jwtUtil;

    @PostMapping("/{listingId}")
    public ResponseEntity<Application> apply(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long listingId) {
        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
        return ResponseEntity.ok(applicationService.apply(email, listingId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Application>> getMyApplications(
            @RequestHeader("Authorization") String authHeader) {
        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
        return ResponseEntity.ok(applicationService.getMyApplications(email));
    }

    @GetMapping("/listing/{listingId}")
    public ResponseEntity<List<Application>> getListingApplications(
            @PathVariable Long listingId) {
        return ResponseEntity.ok(applicationService.getApplicationsForListing(listingId));
    }
}