package com.subsidy.subsidyDisbursement.eligibility.controller;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.subsidy.subsidyDisbursement.eligibility.dto.EligibilityResult;
import com.subsidy.subsidyDisbursement.eligibility.service.EligibilityService;

@RestController
@RequestMapping("/api/eligibility")
public class EligibilityController {

	private final EligibilityService eligibilityService;

	public EligibilityController(EligibilityService eligibilityService) {
		this.eligibilityService = eligibilityService;
	}

	@PostMapping("/application/{id}/evaluate")
	public ResponseEntity<EligibilityResult> evaluateApplication(@PathVariable Long id) {

		return ResponseEntity.ok(eligibilityService.evaluateApplication(id));
	}
}