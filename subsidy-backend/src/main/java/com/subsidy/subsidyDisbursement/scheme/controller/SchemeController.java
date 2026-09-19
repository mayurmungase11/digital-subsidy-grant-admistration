package com.subsidy.subsidyDisbursement.scheme.controller;

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

import com.subsidy.subsidyDisbursement.scheme.dto.SchemeRequestDTO;
import com.subsidy.subsidyDisbursement.scheme.dto.SchemeResponseDTO;
import com.subsidy.subsidyDisbursement.scheme.dto.SchemeUpdateRequestDTO;
import com.subsidy.subsidyDisbursement.scheme.service.SchemeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/schemes")
public class SchemeController {

	private final SchemeService service;

	public SchemeController(SchemeService service) {
		this.service = service;
	}

	// CREATE
	@PostMapping
	public ResponseEntity<SchemeResponseDTO> createScheme(@Valid @RequestBody SchemeRequestDTO request) {

		return ResponseEntity.status(HttpStatus.CREATED).body(service.createScheme(request));
	}

	// GET BY ID
	@GetMapping("/{id}")
	public ResponseEntity<SchemeResponseDTO> getSchemeById(@PathVariable Long id) {

		return ResponseEntity.ok(service.getSchemeById(id));
	}

	// GET ALL
	@GetMapping
	public ResponseEntity<List<SchemeResponseDTO>> getAllScheme() {

		return ResponseEntity.ok(service.getAllScheme());
	}

	// UPDATE
	@PutMapping("/{id}")
	public ResponseEntity<SchemeResponseDTO> updateSchemeById(@PathVariable Long id,
			@Valid @RequestBody SchemeUpdateRequestDTO request) {

		return ResponseEntity.ok(service.updateSchemeById(id, request));
	}

	// DELETE
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteSchemeById(@PathVariable Long id) {

		service.deleteSchemeById(id);

		return ResponseEntity.noContent().build();
	}
}