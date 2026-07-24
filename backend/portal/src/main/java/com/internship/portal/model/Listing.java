package com.internship.portal.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "listings")
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String location;

    private String duration;

    private LocalDate deadline;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
}