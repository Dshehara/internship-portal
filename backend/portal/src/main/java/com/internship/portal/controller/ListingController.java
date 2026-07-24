package com.internship.portal.controller;

import com.internship.portal.config.JwtUtil;
import com.internship.portal.dto.ListingRequest;
import com.internship.portal.model.Listing;
import com.internship.portal.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<Listing>> getAllListings() {
        return ResponseEntity.ok(listingService.getAllListings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Listing> getListingById(@PathVariable Long id) {
        return ResponseEntity.ok(listingService.getListingById(id));
    }

    @PostMapping
    public ResponseEntity<Listing> createListing(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ListingRequest request) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        return ResponseEntity.ok(listingService.createListing(email, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
        listingService.deleteListing(id, email);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Listing> updateListing(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody ListingRequest request) {
        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
        return ResponseEntity.ok(listingService.updateListing(id, email, request));
    }
}