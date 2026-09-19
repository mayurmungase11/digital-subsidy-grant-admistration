package com.subsidy.subsidyDisbursement.schemeDistrict.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.subsidy.subsidyDisbursement.schemeDistrict.dto.SchemeDistrictRequestDTO;
import com.subsidy.subsidyDisbursement.schemeDistrict.dto.SchemeDistrictResponseDTO;
import com.subsidy.subsidyDisbursement.schemeDistrict.service.SchemeDistrictService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/schemeDistricts")
public class SchemeDistrictController {

    private final SchemeDistrictService service;

    public SchemeDistrictController(SchemeDistrictService service) {
        this.service = service;
    }

    // CREATE

    @PostMapping
    public ResponseEntity<SchemeDistrictResponseDTO> createSchemeDistrict(
            @Valid @RequestBody SchemeDistrictRequestDTO request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.createSchemeDistrict(request));
    }

    // GET BY ID

    @GetMapping("/{id}")
    public ResponseEntity<SchemeDistrictResponseDTO> getSchemeDistrictById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getSchemeDistrictById(id));
    }

    // GET ALL

    @GetMapping
    public ResponseEntity<List<SchemeDistrictResponseDTO>> getAllSchemeDistrict() {

        return ResponseEntity.ok(
                service.getAllSchemeDistrict());
    }

    // UPDATE

    @PutMapping("/{id}")
    public ResponseEntity<SchemeDistrictResponseDTO> updateSchemeDistrictById(
            @PathVariable Long id,
            @Valid @RequestBody SchemeDistrictRequestDTO request) {

        return ResponseEntity.ok(
                service.updateSchemeDistrictById(id, request));
    }

    // DELETE

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchemeDistrictById(
            @PathVariable Long id) {

        service.deleteSchemeDistrictById(id);

        return ResponseEntity.noContent().build();
    }
}