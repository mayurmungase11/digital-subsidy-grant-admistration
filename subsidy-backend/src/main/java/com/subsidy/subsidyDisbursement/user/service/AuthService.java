package com.subsidy.subsidyDisbursement.user.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.subsidy.subsidyDisbursement.user.dto.LoginRequestDTO;
import com.subsidy.subsidyDisbursement.user.dto.LoginResponseDTO;
import com.subsidy.subsidyDisbursement.user.security.JwtService;
import com.subsidy.subsidyDisbursement.user.entity.User;
import com.subsidy.subsidyDisbursement.user.repository.UserRepository;

@Service
public class AuthService {

	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;
	private final UserRepository userRepository;

	public AuthService(AuthenticationManager authenticationManager, JwtService jwtService, UserRepository userRepository) {

		this.authenticationManager = authenticationManager;
		this.jwtService = jwtService;
		this.userRepository = userRepository;
		
	}

	public LoginResponseDTO login(LoginRequestDTO request) {

		Authentication authentication = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

		UserDetails userDetails = (UserDetails) authentication.getPrincipal();
		User user = userRepository.findByEmail(userDetails.getUsername())
				.orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

		String token = jwtService.generateToken(userDetails);

		String role = userDetails.getAuthorities().iterator().next().getAuthority();

		LoginResponseDTO response = new LoginResponseDTO();

		response.setUserId(user.getId());
		response.setToken(token);
		response.setTokenType("Bearer");
		response.setEmail(userDetails.getUsername());
		response.setRole(role);

		return response;
	}
}