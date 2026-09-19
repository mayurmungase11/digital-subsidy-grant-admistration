package com.subsidy.subsidyDisbursement.state.service;

import org.springframework.stereotype.Service;

import com.subsidy.subsidyDisbursement.state.dto.StateRequestDTO;
import com.subsidy.subsidyDisbursement.state.dto.StateResponseDTO;
import com.subsidy.subsidyDisbursement.state.entity.State;
import com.subsidy.subsidyDisbursement.state.repository.StateRepository;

@Service
public class StateService {

	private final StateRepository srepo;

	public StateService(StateRepository repo) {
		this.srepo = repo;
	}

	// CREATE
	public StateResponseDTO createState(StateRequestDTO request) {

		State state = new State();

		state.setName(request.getName());

		State savedState = srepo.save(state);

		return mapToResponse(savedState);
	}

	// ENTITY → RESPONSE DTO
	private StateResponseDTO mapToResponse(State state) {

		StateResponseDTO response = new StateResponseDTO();

		response.setId(state.getId());
		response.setName(state.getName());

		return response;
	}
	// GET BY ID
	public StateResponseDTO getStateById(Long stateId) {

		State state = srepo.findById(stateId)
				.orElseThrow(() -> new RuntimeException("State not found with id: " + stateId));
		return mapToResponse(state);
	}

	public Object getAllStates() {
		
		return srepo.findAll().stream().map(this::mapToResponse).toList();
	}

	public void deleteState(Long stateId) {
		
		srepo.deleteById(stateId);
		
	}
}