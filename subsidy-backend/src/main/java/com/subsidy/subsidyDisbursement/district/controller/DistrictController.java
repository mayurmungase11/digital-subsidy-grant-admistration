package com.subsidy.subsidyDisbursement.district.controller;

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

import com.subsidy.subsidyDisbursement.district.dto.DistrictRequestDTO;
import com.subsidy.subsidyDisbursement.district.dto.DistrictResponseDTO;
import com.subsidy.subsidyDisbursement.district.dto.DistrictUpdateRequestDTO;
import com.subsidy.subsidyDisbursement.district.service.DistrictService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/districts")
public class DistrictController {

	private final DistrictService service;

	public DistrictController(DistrictService service) {

		this.service = service;

	}

	// CREATE
	@PostMapping
	public ResponseEntity<DistrictResponseDTO> createDistrict(@Valid @RequestBody DistrictRequestDTO request) {

		return ResponseEntity.status(HttpStatus.CREATED).body(service.createDistrict(request));
	}

	// GET BY ID
	@GetMapping("/{id}")
	public ResponseEntity<DistrictResponseDTO> getDistrictById(@PathVariable Long id) {

		return ResponseEntity.ok(service.getDistrictById(id));
	}

	// GET ALL
	@GetMapping
	public ResponseEntity<List<DistrictResponseDTO>> getAllDistricts() {

		return ResponseEntity.ok(service.getAllDistricts());
	}

	// UPDATE
	@PutMapping("/{id}")
	public ResponseEntity<DistrictResponseDTO> updateDistrict(@Valid @RequestBody DistrictUpdateRequestDTO request,
			@PathVariable Long id) {

		return ResponseEntity.ok(service.updateDistrict(request, id));
	}

	// DELETE
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteDistrictById(@PathVariable Long id) {

		service.deleteDistrictById(id);

		return ResponseEntity.noContent().build();
	}
}