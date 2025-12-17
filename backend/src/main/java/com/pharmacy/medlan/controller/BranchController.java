package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.model.organization.Branch;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/branch")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BranchController {

    private BranchService branchService;

    @PostMapping("/create")
    public ResponseEntity<Branch> createBranch(@RequestBody Branch branch){
        return ResponseEntity.ok(branchService.createBranch(branch));
    }
}
