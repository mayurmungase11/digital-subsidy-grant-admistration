package com.subsidy.subsidyDisbursement.user.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.subsidy.subsidyDisbursement.exception.ResourceNotFoundException;
import com.subsidy.subsidyDisbursement.user.dto.RoleRequestDTO;
import com.subsidy.subsidyDisbursement.user.dto.RoleResponseDTO;
import com.subsidy.subsidyDisbursement.user.dto.RoleUpdateRequestDTO;
import com.subsidy.subsidyDisbursement.user.entity.Role;
import com.subsidy.subsidyDisbursement.user.repository.RoleRepository;

@Service
public class RoleService {

	private final RoleRepository roleRepository;

	public RoleService(RoleRepository repo) {
		this.roleRepository = repo;
	}

	// CREATE
	public RoleResponseDTO createRole(RoleRequestDTO request) {

		Role role = new Role();

		role.setName(request.getName());

		Role savedRole = roleRepository.save(role);

		return mapToResponse(savedRole);
	}

	// GET BY ID
	public RoleResponseDTO getRoleById(Long id) {

		Role role = roleRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));

		return mapToResponse(role);
	}

	// GET ALL
	public List<RoleResponseDTO> getAllRoles() {

		return roleRepository.findAll().stream().map(this::mapToResponse).toList();
	}

	// UPDATE BY ID
	public RoleResponseDTO updateRoleById(Long id, RoleUpdateRequestDTO request) {

		Role role = roleRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));

		if (request.getName() != null) {
			role.setName(request.getName());
		}

		Role updatedRole = roleRepository.save(role);

		return mapToResponse(updatedRole);
	}

	// DELETE BY ID
	public void deleteRoleById(Long id) {

		Role role = roleRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));

		roleRepository.delete(role);
	}

	// ENTITY → RESPONSE DTO
	private RoleResponseDTO mapToResponse(Role role) {

		RoleResponseDTO response = new RoleResponseDTO();

		response.setId(role.getId());
		response.setName(role.getName());

		return response;
	}
}