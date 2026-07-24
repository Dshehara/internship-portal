package com.internship.portal.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ListingRequest {
    private String title;
    private String description;
    private String location;
    private String duration;
    private LocalDate deadline;
}