package com.subsidy.subsidyDisbursement.user.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.subsidy.subsidyDisbursement.user.dto.UserRequestDTO;
import com.subsidy.subsidyDisbursement.user.dto.UserResponseDTO;
import com.subsidy.subsidyDisbursement.user.dto.UserUpdateRequestDTO;
import com.subsidy.subsidyDisbursement.user.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService service;

	public UserController(UserService service) {
		this.service = service;
	}

	// CREATE
	@PostMapping
	public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO request) {

		return ResponseEntity.status(HttpStatus.CREATED).body(service.createUser(request));
	}

	// GET BY ID
	@GetMapping("/{id}")
	public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {

		return ResponseEntity.ok(service.getUserById(id));
	}

	// GET ALL
	@GetMapping
	public ResponseEntity<List<UserResponseDTO>> getAllUsers() {

		return ResponseEntity.ok(service.getAllUsers());
	}

	// UPDATE BY ID
	@PutMapping("/{id}")
	public ResponseEntity<UserResponseDTO> updateUserById(@PathVariable Long id,
			@Valid @RequestBody UserUpdateRequestDTO request) {

		return ResponseEntity.ok(service.updateUserById(id, request));
	}
	
	// DELETE BY ID
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteUserById(@PathVariable Long id) {

		service.deleteUserById(id);
		return ResponseEntity.noContent().build();
	}
	
}