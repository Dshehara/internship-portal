package com.internship.portal.repository;

import com.internship.portal.model.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {
    List<Listing> findByCompanyId(Long companyId);
}