package com.subsidy.subsidyDisbursement.beneficiary.controller;

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
import org.springframework.security.core.Authentication;

import com.subsidy.subsidyDisbursement.beneficiary.dto.BeneficiaryRequestDTO;
import com.subsidy.subsidyDisbursement.beneficiary.dto.BeneficiaryResponseDTO;
import com.subsidy.subsidyDisbursement.beneficiary.dto.BeneficiaryUpdateDTO;
import com.subsidy.subsidyDisbursement.beneficiary.service.BeneficiaryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/beneficiaries")
public class BeneficiaryController {

	private final BeneficiaryService service;

	public BeneficiaryController(BeneficiaryService service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<BeneficiaryResponseDTO> createBeneficiary(@Valid @RequestBody BeneficiaryRequestDTO request) {

		return ResponseEntity.status(HttpStatus.CREATED).body(service.createBeneficiary(request));
	}

	@GetMapping("/my")
	public ResponseEntity<BeneficiaryResponseDTO> getMyProfile(Authentication authentication) {
		return ResponseEntity.ok(service.getMyProfile(authentication.getName()));
	}

	@PutMapping("/my")
	public ResponseEntity<BeneficiaryResponseDTO> updateMyProfile(
			@Valid @RequestBody BeneficiaryUpdateDTO request,
			Authentication authentication) {
		return ResponseEntity.ok(service.updateMyProfile(request, authentication.getName()));
	}

	@GetMapping("/{id}")
	public ResponseEntity<BeneficiaryResponseDTO> getBenefiaciaryById(@PathVariable Long id) {

		return ResponseEntity.ok(service.getBenefiaciaryById(id));
	}

	@GetMapping
	public ResponseEntity<List<BeneficiaryResponseDTO>> getAllBeneficiary() {

		return ResponseEntity.ok(service.getAllBeneficiary());
	}

	@PutMapping("/{id}")
	public ResponseEntity<BeneficiaryResponseDTO> updateBeneficiary(@Valid @RequestBody BeneficiaryUpdateDTO request,
			@PathVariable Long id) {

		return ResponseEntity.ok(service.updateBeneficiary(request, id));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteBeneficiaryById(@PathVariable Long id) {

		service.deleteBeneficiaryById(id);

		return ResponseEntity.noContent().build();
	}
}