package com.subsidy.subsidyDisbursement.application.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.subsidy.subsidyDisbursement.application.dto.ApplicationRequestDTO;
import com.subsidy.subsidyDisbursement.application.dto.ApplicationResponseDTO;
import com.subsidy.subsidyDisbursement.application.dto.ApplicationUpdateRequestDTO;
import com.subsidy.subsidyDisbursement.application.dto.BeneficiaryApplicationRequestDTO;
import com.subsidy.subsidyDisbursement.application.service.ApplicationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

	private final ApplicationService service;

	public ApplicationController(ApplicationService service) {
		this.service = service;
	}

	// CREATE
	@PostMapping
	public ResponseEntity<ApplicationResponseDTO> createApplication(@Valid @RequestBody ApplicationRequestDTO request) {

		return ResponseEntity.status(HttpStatus.CREATED).body(service.createApplication(request));
	}
	
	// CREATE APPLICATION - LOGGED-IN BENEFICIARY
	@PostMapping("/my")
	public ResponseEntity<ApplicationResponseDTO> createApplicationForBeneficiary(
	        @Valid @RequestBody BeneficiaryApplicationRequestDTO request) {

	    return ResponseEntity.status(201).body(
	            service.createApplicationForBeneficiary(request)
	    );
	}

	// GET BY ID
	@GetMapping("/{id}")
	public ResponseEntity<ApplicationResponseDTO> getApplicationById(@PathVariable Long id) {

		return ResponseEntity.ok(service.getApplicationById(id));
	}
	
	// GET MY APPLICATIONS - LOGGED-IN BENEFICIARY
	@GetMapping("/my")
	public ResponseEntity<List<ApplicationResponseDTO>> getMyApplications() {

	    return ResponseEntity.ok(
	            service.getMyApplications()
	    );
	}

	// GET ALL
	@GetMapping
	public ResponseEntity<List<ApplicationResponseDTO>> getAllApplications() {

		return ResponseEntity.ok(service.getAllApplications());
	}

	// UPDATE
	@PutMapping("/{id}")
	public ResponseEntity<ApplicationResponseDTO> updateApplicationById(@PathVariable Long id,
			@Valid @RequestBody ApplicationUpdateRequestDTO request) {

		return ResponseEntity.ok(service.updateApplicationById(id, request));
	}

	// DELETE
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteApplicationById(@PathVariable Long id) {

		service.deleteApplicationById(id);

		return ResponseEntity.noContent().build();
	}
}