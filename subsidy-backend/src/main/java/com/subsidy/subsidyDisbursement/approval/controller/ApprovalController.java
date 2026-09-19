package com.subsidy.subsidyDisbursement.approval.controller;

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

import com.subsidy.subsidyDisbursement.approval.dto.ApprovalRequestDTO;
import com.subsidy.subsidyDisbursement.approval.dto.ApprovalResponseDTO;
import com.subsidy.subsidyDisbursement.approval.dto.ApprovalUpdateRequestDTO;
import com.subsidy.subsidyDisbursement.approval.service.ApprovalService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/approvals")
public class ApprovalController {

	private final ApprovalService approvalService;

	public ApprovalController(ApprovalService approvalService) {
		this.approvalService = approvalService;
	}

	// CREATE
	@PostMapping
	public ResponseEntity<ApprovalResponseDTO> createApproval(@Valid @RequestBody ApprovalRequestDTO request) {

		return ResponseEntity.status(HttpStatus.CREATED).body(approvalService.createApproval(request));
	}

	// GET BY ID
	@GetMapping("/{id}")
	public ResponseEntity<ApprovalResponseDTO> getApprovalById(@PathVariable Long id) {

		return ResponseEntity.ok(approvalService.getApprovalById(id));
	}

	// GET ALL
	@GetMapping
	public ResponseEntity<List<ApprovalResponseDTO>> getAllApprovals() {

		return ResponseEntity.ok(approvalService.getAllApprovals());
	}

	// UPDATE BY ID
	@PutMapping("/{id}")
	public ResponseEntity<ApprovalResponseDTO> updateApprovalById(@PathVariable Long id,
			@Valid @RequestBody ApprovalUpdateRequestDTO request) {

		return ResponseEntity.ok(approvalService.updateApprovalById(id, request));
	}

	// DELETE BY ID
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteApprovalById(@PathVariable Long id) {

		approvalService.deleteApprovalById(id);

		return ResponseEntity.noContent().build();
	}
}