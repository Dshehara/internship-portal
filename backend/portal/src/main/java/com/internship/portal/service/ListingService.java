package com.internship.portal.service;

import com.internship.portal.dto.ListingRequest;
import com.internship.portal.model.Company;
import com.internship.portal.model.Listing;
import com.internship.portal.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final CompanyService companyService;

    public Listing createListing(String companyEmail, ListingRequest request) {
        Company company = companyService.getByEmail(companyEmail);
        Listing listing = new Listing();
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setLocation(request.getLocation());
        listing.setDuration(request.getDuration());
        listing.setDeadline(request.getDeadline());
        listing.setCompany(company);
        return listingRepository.save(listing);
    }

    public List<Listing> getAllListings() {
        return listingRepository.findAll();
    }

    public Listing getListingById(Long id) {
        return listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
    }

    public void deleteListing(Long id, String companyEmail) {
        Listing listing = getListingById(id);
        if (!listing.getCompany().getEmail().equals(companyEmail)) {
            throw new RuntimeException("Not authorized to delete this listing");
        }
        listingRepository.delete(listing);
    }

    public Listing updateListing(Long id, String companyEmail, ListingRequest request) {
        Listing listing = getListingById(id);
        if (!listing.getCompany().getEmail().equals(companyEmail)) {
            throw new RuntimeException("Not authorized to edit this listing");
        }
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setLocation(request.getLocation());
        listing.setDuration(request.getDuration());
        listing.setDeadline(request.getDeadline());
        return listingRepository.save(listing);
    }
}