package com.subsidy.subsidyDisbursement.eligibilityCriteria.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.subsidy.subsidyDisbursement.eligibilityCriteria.dto.EligibilityCriteriaRequestDTO;
import com.subsidy.subsidyDisbursement.eligibilityCriteria.dto.EligibilityCriteriaResponseDTO;
import com.subsidy.subsidyDisbursement.eligibilityCriteria.dto.EligibilityCriteriaUpdateRequestDTO;
import com.subsidy.subsidyDisbursement.eligibilityCriteria.service.EligibilityCriteriaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/eligibility-criteria")
public class EligibilityCriteriaController {

    private final EligibilityCriteriaService service;

    public EligibilityCriteriaController(
            EligibilityCriteriaService service) {

        this.service = service;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<EligibilityCriteriaResponseDTO> createCriterion(
            @Valid @RequestBody EligibilityCriteriaRequestDTO criteria) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.createCriteria(criteria));
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<EligibilityCriteriaResponseDTO> getCriterionById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getCriteriaById(id)
        );
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<EligibilityCriteriaResponseDTO>> getAllCriteria() {

        return ResponseEntity.ok(
                service.getAllCriteria()
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<EligibilityCriteriaResponseDTO> updateCriteria(
            @PathVariable Long id,
            @Valid @RequestBody EligibilityCriteriaUpdateRequestDTO updatedCriteria) {

        return ResponseEntity.ok(
                service.updateCriteria(id, updatedCriteria)
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCriteria(
            @PathVariable Long id) {

        service.deleteCriteria(id);

        return ResponseEntity.noContent().build();
    }
}