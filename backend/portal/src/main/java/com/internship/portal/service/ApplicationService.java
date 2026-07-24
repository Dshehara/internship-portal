package com.internship.portal.service;

import com.internship.portal.model.Application;
import com.internship.portal.model.Listing;
import com.internship.portal.model.Student;
import com.internship.portal.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentService studentService;
    private final ListingService listingService;

    public Application apply(String studentEmail, Long listingId) {
        if (applicationRepository.existsByStudent_EmailAndListingId(studentEmail, listingId)) {
            throw new RuntimeException("Already applied for this internship");
        }
        Student student = studentService.getByEmail(studentEmail);
        Listing listing = listingService.getListingById(listingId);

        Application application = new Application();
        application.setStudent(student);
        application.setListing(listing);
        application.setAppliedDate(LocalDate.now());
        application.setStatus("PENDING");

        return applicationRepository.save(application);
    }

    public List<Application> getMyApplications(String studentEmail) {
        return applicationRepository.findByStudent_Email(studentEmail);
    }

    public List<Application> getApplicationsForListing(Long listingId) {
        return applicationRepository.findByListingId(listingId);
    }
}