package com.pharmacy.medlan.model;

import jakarta.persistence.*;

@Entity
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "branch_id")
    private long branchId;

    @Column(name = "name")
    private String name;
}
