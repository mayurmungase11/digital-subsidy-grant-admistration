package com.subsidy.subsidyDisbursement.state.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.subsidy.subsidyDisbursement.state.dto.StateRequestDTO;
import com.subsidy.subsidyDisbursement.state.dto.StateResponseDTO;
import com.subsidy.subsidyDisbursement.state.service.StateService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/states")
public class StateController {

	private final StateService service;

	public StateController(StateService service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<StateResponseDTO> createState(@Valid @RequestBody StateRequestDTO request) {

		return ResponseEntity.status(HttpStatus.CREATED).body(service.createState(request));
	}
	
	@GetMapping("/{stateId}")
	public ResponseEntity<StateResponseDTO> getStateById(@PathVariable Long stateId) {
		StateResponseDTO stateResponse = service.getStateById(stateId);
		return ResponseEntity.ok(stateResponse);
	}
	
	@GetMapping
	public ResponseEntity<?> getAllStates() {
		return ResponseEntity.ok(service.getAllStates());
	}
	
	@DeleteMapping("/{stateId}")
	public ResponseEntity<Void> deleteState(@PathVariable Long stateId) {
		service.deleteState(stateId);
		return ResponseEntity.noContent().build();
	}
	
	
	
}