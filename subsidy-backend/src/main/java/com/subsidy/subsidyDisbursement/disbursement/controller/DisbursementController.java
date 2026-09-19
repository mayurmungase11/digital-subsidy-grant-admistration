package com.subsidy.subsidyDisbursement.disbursement.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.subsidy.subsidyDisbursement.disbursement.dto.DisbursementRequestDTO;
import com.subsidy.subsidyDisbursement.disbursement.dto.DisbursementResponseDTO;
import com.subsidy.subsidyDisbursement.disbursement.dto.DisbursementUpdateRequestDTO;
import com.subsidy.subsidyDisbursement.disbursement.service.DisbursementService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/disbursements")
public class DisbursementController {

	private final DisbursementService disbursementService;

	public DisbursementController(DisbursementService disbursementService) {
		this.disbursementService = disbursementService;
	}

	// CREATE
	@PostMapping
	public ResponseEntity<DisbursementResponseDTO> createDisbursement(
			@Valid @RequestBody DisbursementRequestDTO request) {

		return ResponseEntity.status(HttpStatus.CREATED).body(disbursementService.createDisbursement(request));
	}

	// GET BY ID
	@GetMapping("/{id}")
	public ResponseEntity<DisbursementResponseDTO> getDisbursementById(@PathVariable Long id) {

		return ResponseEntity.ok(disbursementService.getDisbursementById(id));
	}

	// GET ALL
	@GetMapping
	public ResponseEntity<List<DisbursementResponseDTO>> getAllDisbursements() {

		return ResponseEntity.ok(disbursementService.getAllDisbursements());
	}

	// UPDATE BY ID
	@PutMapping("/{id}")
	public ResponseEntity<DisbursementResponseDTO> updateDisbursementById(@PathVariable Long id,
			@Valid @RequestBody DisbursementUpdateRequestDTO request) {

		return ResponseEntity.ok(disbursementService.updateDisbursementById(id, request));
	}

	// DELETE BY ID
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteDisbursementById(@PathVariable Long id) {

		disbursementService.deleteDisbursementById(id);

		return ResponseEntity.noContent().build();
	}
}