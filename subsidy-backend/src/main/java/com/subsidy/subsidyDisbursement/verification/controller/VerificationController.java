package com.subsidy.subsidyDisbursement.verification.controller;

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

import com.subsidy.subsidyDisbursement.verification.dto.VerificationRequestDTO;
import com.subsidy.subsidyDisbursement.verification.dto.VerificationResponseDTO;
import com.subsidy.subsidyDisbursement.verification.dto.VerificationUpdateRequestDTO;
import com.subsidy.subsidyDisbursement.verification.service.VerificationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/verifications")
public class VerificationController {

	private final VerificationService verificationService;

	public VerificationController(VerificationService verificationService) {
		this.verificationService = verificationService;
	}

	// CREATE
	@PostMapping
	public ResponseEntity<VerificationResponseDTO> createVerification(
			@Valid @RequestBody VerificationRequestDTO request) {

		return ResponseEntity.status(HttpStatus.CREATED).body(verificationService.createVerification(request));
	}

	// GET BY ID
	@GetMapping("/{id}")
	public ResponseEntity<VerificationResponseDTO> getVerificationById(@PathVariable Long id) {

		return ResponseEntity.ok(verificationService.getVerificationById(id));
	}

	// GET ALL
	@GetMapping
	public ResponseEntity<List<VerificationResponseDTO>> getAllVerifications() {

		return ResponseEntity.ok(verificationService.getAllVerifications());
	}

	// UPDATE
	@PutMapping("/{id}")
	public ResponseEntity<VerificationResponseDTO> updateVerificationById(@PathVariable Long id,
			@Valid @RequestBody VerificationUpdateRequestDTO request) {

		return ResponseEntity.ok(verificationService.updateVerificationById(id, request));
	}

	// DELETE
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteVerificationById(@PathVariable Long id) {

		verificationService.deleteVerificationById(id);

		return ResponseEntity.noContent().build();
	}
}