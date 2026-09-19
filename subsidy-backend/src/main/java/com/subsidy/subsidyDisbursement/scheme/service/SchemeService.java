package com.subsidy.subsidyDisbursement.scheme.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.subsidy.subsidyDisbursement.scheme.dto.SchemeRequestDTO;
import com.subsidy.subsidyDisbursement.scheme.dto.SchemeResponseDTO;
import com.subsidy.subsidyDisbursement.scheme.dto.SchemeUpdateRequestDTO;
import com.subsidy.subsidyDisbursement.scheme.entity.Scheme;
import com.subsidy.subsidyDisbursement.scheme.repository.SchemeRepository;

import com.subsidy.subsidyDisbursement.exception.ResourceNotFoundException;

@Service
public class SchemeService {

	private final SchemeRepository srepo;

	public SchemeService(SchemeRepository repo) {
		this.srepo = repo;
	}

	// CREATE
	public SchemeResponseDTO createScheme(SchemeRequestDTO request) {

		Scheme scheme = new Scheme();

		scheme.setCode(request.getCode());
		scheme.setName(request.getName());
		scheme.setMaximumAmount(request.getMaximumAmount());
		scheme.setActive(request.getActive());

		Scheme savedScheme = srepo.save(scheme);

		return mapToResponse(savedScheme);
	}

	// GET BY ID
	public SchemeResponseDTO getSchemeById(Long id) {

		Scheme scheme = srepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Scheme not found with id: " + id));

		return mapToResponse(scheme);
	}

	// GET ALL
	public List<SchemeResponseDTO> getAllScheme() {

		return srepo.findAll().stream().map(this::mapToResponse).toList();
	}

	// UPDATE
	public SchemeResponseDTO updateSchemeById(Long id, SchemeUpdateRequestDTO request) {

		Scheme scheme = srepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Scheme not found with id: " + id));

		if (request.getCode() != null) {
			scheme.setCode(request.getCode());
		}

		if (request.getName() != null) {
			scheme.setName(request.getName());
		}

		if (request.getMaximumAmount() != null) {
			scheme.setMaximumAmount(request.getMaximumAmount());
		}

		if (request.getActive() != null) {
			scheme.setActive(request.getActive());
		}

		Scheme updatedScheme = srepo.save(scheme);

		return mapToResponse(updatedScheme);
	}

	// DELETE
	public void deleteSchemeById(Long id) {

		Scheme scheme = srepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Scheme not found with id: " + id));

		srepo.delete(scheme);
	}

	// ENTITY → RESPONSE DTO
	private SchemeResponseDTO mapToResponse(Scheme scheme) {

		SchemeResponseDTO response = new SchemeResponseDTO();

		response.setId(scheme.getId());
		response.setCode(scheme.getCode());
		response.setName(scheme.getName());
		response.setMaximumAmount(scheme.getMaximumAmount());
		response.setActive(scheme.getActive());

		return response;
	}
}