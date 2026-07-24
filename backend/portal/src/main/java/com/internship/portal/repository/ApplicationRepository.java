package com.internship.portal.repository;

import com.internship.portal.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent_Email(String email);
    List<Application> findByListingId(Long listingId);
    boolean existsByStudent_EmailAndListingId(String email, Long listingId);
}