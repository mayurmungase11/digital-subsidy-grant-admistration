package com.subsidy.subsidyDisbursement.user.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.subsidy.subsidyDisbursement.exception.DuplicateResourceException;
import com.subsidy.subsidyDisbursement.exception.ResourceNotFoundException;
import com.subsidy.subsidyDisbursement.user.dto.UserRequestDTO;
import com.subsidy.subsidyDisbursement.user.dto.UserResponseDTO;
import com.subsidy.subsidyDisbursement.user.dto.UserUpdateRequestDTO;
import com.subsidy.subsidyDisbursement.user.entity.Role;
import com.subsidy.subsidyDisbursement.user.entity.User;
import com.subsidy.subsidyDisbursement.user.repository.RoleRepository;
import com.subsidy.subsidyDisbursement.user.repository.UserRepository;

@Service
public class UserService {

	private final UserRepository userRepo;
	private final RoleRepository roleRepo;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository repo, RoleRepository roleRepo, PasswordEncoder passwordEncoder) {

		this.userRepo = repo;
		this.roleRepo = roleRepo;
		this.passwordEncoder = passwordEncoder;
	}

	// CREATE
	public UserResponseDTO createUser(UserRequestDTO request) {

		if (userRepo.existsByEmail(request.getEmail())) {
			throw new DuplicateResourceException("Email already registered: " + request.getEmail());
		}

		Role role = roleRepo.findById(request.getRoleId())
				.orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + request.getRoleId()));

		User user = new User();

		user.setName(request.getName());
		user.setEmail(request.getEmail());

		// Encode password before storing in database
		user.setPassword(passwordEncoder.encode(request.getPassword()));

		user.setRole(role);

		User savedUser = userRepo.save(user);

		return mapToResponse(savedUser);
	}

	// GET BY ID
	public UserResponseDTO getUserById(Long id) {

		User user = userRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

		return mapToResponse(user);
	}

	// GET ALL
	public List<UserResponseDTO> getAllUsers() {

		return userRepo.findAll().stream().map(this::mapToResponse).toList();
	}

	// UPDATE BY ID
	public UserResponseDTO updateUserById(Long id, UserUpdateRequestDTO request) {

		User existingUser = userRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

		// Update name
		if (request.getName() != null) {
			existingUser.setName(request.getName());
		}

		// Update email
		if (request.getEmail() != null) {

			if (!request.getEmail().equals(existingUser.getEmail()) && userRepo.existsByEmail(request.getEmail())) {

				throw new DuplicateResourceException("Email already registered: " + request.getEmail());
			}

			existingUser.setEmail(request.getEmail());
		}

		// Update password
		if (request.getPassword() != null) {

			// Encode new password before storing
			existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
		}

		// Update role
		if (request.getRoleId() != null) {

			Role role = roleRepo.findById(request.getRoleId())
					.orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + request.getRoleId()));

			existingUser.setRole(role);
		}

		User updatedUser = userRepo.save(existingUser);

		return mapToResponse(updatedUser);
	}

	// ENTITY → RESPONSE DTO
	private UserResponseDTO mapToResponse(User user) {

		UserResponseDTO response = new UserResponseDTO();

		response.setId(user.getId());
		response.setName(user.getName());
		response.setEmail(user.getEmail());

		if (user.getRole() != null) {
			response.setRoleId(user.getRole().getId());
		}

		return response;
	}

	public void deleteUserById(Long id) {
		 
		if (!userRepo.existsById(id)) {
			throw new ResourceNotFoundException("User not found with id: " + id);
		}

		userRepo.deleteById(id);
		
	}
}