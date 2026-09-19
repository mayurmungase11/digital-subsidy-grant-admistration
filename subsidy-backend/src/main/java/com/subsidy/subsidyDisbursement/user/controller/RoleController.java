package com.subsidy.subsidyDisbursement.user.controller;

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

import com.subsidy.subsidyDisbursement.user.dto.RoleRequestDTO;
import com.subsidy.subsidyDisbursement.user.dto.RoleResponseDTO;
import com.subsidy.subsidyDisbursement.user.dto.RoleUpdateRequestDTO;
import com.subsidy.subsidyDisbursement.user.service.RoleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

	private final RoleService service;

	public RoleController(RoleService service) {
		this.service = service;
	}

	// CREATE
	@PostMapping
	public ResponseEntity<RoleResponseDTO> createRole(@Valid @RequestBody RoleRequestDTO request) {

		return ResponseEntity.status(HttpStatus.CREATED).body(service.createRole(request));
	}

	// GET BY ID
	@GetMapping("/{id}")
	public ResponseEntity<RoleResponseDTO> getRoleById(@PathVariable Long id) {

		return ResponseEntity.ok(service.getRoleById(id));
	}

	// GET ALL
	@GetMapping
	public ResponseEntity<List<RoleResponseDTO>> getAllRoles() {

		return ResponseEntity.ok(service.getAllRoles());
	}

	// UPDATE BY ID
	@PutMapping("/{id}")
	public ResponseEntity<RoleResponseDTO> updateRoleById(@PathVariable Long id,
			@Valid @RequestBody RoleUpdateRequestDTO request) {

		return ResponseEntity.ok(service.updateRoleById(id, request));
	}

	// DELETE BY ID
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteRoleById(@PathVariable Long id) {

		service.deleteRoleById(id);

		return ResponseEntity.noContent().build();
	}
}