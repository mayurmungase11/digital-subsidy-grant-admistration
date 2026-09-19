package com.subsidy.subsidyDisbursement.disbursement.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.subsidy.subsidyDisbursement.application.entity.Application;
import com.subsidy.subsidyDisbursement.application.repository.ApplicationRepository;
import com.subsidy.subsidyDisbursement.approval.entity.Approval;
import com.subsidy.subsidyDisbursement.approval.entity.ApprovalStatus;
import com.subsidy.subsidyDisbursement.approval.repository.ApprovalRepository;

import com.subsidy.subsidyDisbursement.disbursement.dto.DisbursementRequestDTO;
import com.subsidy.subsidyDisbursement.disbursement.dto.DisbursementResponseDTO;
import com.subsidy.subsidyDisbursement.disbursement.dto.DisbursementUpdateRequestDTO;
import com.subsidy.subsidyDisbursement.disbursement.entity.Disbursement;
import com.subsidy.subsidyDisbursement.disbursement.repository.DisbursementRepository;

import com.subsidy.subsidyDisbursement.exception.DisbursementException;
import com.subsidy.subsidyDisbursement.exception.ResourceNotFoundException;

@Service
public class DisbursementService {

	private final DisbursementRepository disbursementRepository;
	private final ApplicationRepository applicationRepository;
	private final ApprovalRepository approvalRepository;

	public DisbursementService(DisbursementRepository disbursementRepository,
			ApplicationRepository applicationRepository, ApprovalRepository approvalRepository) {

		this.disbursementRepository = disbursementRepository;
		this.applicationRepository = applicationRepository;
		this.approvalRepository = approvalRepository;
	}

	// CREATE
	public DisbursementResponseDTO createDisbursement(DisbursementRequestDTO request) {

		// Find application
		Application application = applicationRepository.findById(request.getApplicationId()).orElseThrow(
				() -> new ResourceNotFoundException("Application not found with id: " + request.getApplicationId()));

		// Find approval
		Approval approval = approvalRepository.findByApplicationId(request.getApplicationId())
				.orElseThrow(() -> new ResourceNotFoundException(
						"Approval not found for application id: " + request.getApplicationId()));

		// Application must be APPROVED
		if (approval.getStatus() != ApprovalStatus.APPROVED) {

			throw new DisbursementException("Application is not approved for disbursement");
		}

		// Check approved amount
		Double approvedAmount = approval.getApprovedAmount();

		Double alreadyDisbursed = disbursementRepository.getTotalDisbursedAmount(request.getApplicationId());

		// Handle null total safely
		if (alreadyDisbursed == null) {
			alreadyDisbursed = 0.0;
		}

		Double totalAfterDisbursement = alreadyDisbursed + request.getAmount();

		if (totalAfterDisbursement > approvedAmount) {

			throw new DisbursementException("Disbursement amount exceeds approved amount");
		}

		// Create entity
		Disbursement disbursement = new Disbursement();

		disbursement.setApplication(application);
		disbursement.setInstallmentNumber(request.getInstallmentNumber());
		disbursement.setAmount(request.getAmount());
		disbursement.setStatus(request.getStatus());
		disbursement.setTransactionReference(request.getTransactionReference());
		disbursement.setRemarks(request.getRemarks());

		// Backend controlled timestamp
		disbursement.setDisbursementDate(LocalDateTime.now());

		Disbursement savedDisbursement = disbursementRepository.save(disbursement);
		
		return mapToResponse(savedDisbursement);
	}

	// GET BY ID
	public DisbursementResponseDTO getDisbursementById(Long id) {

		Disbursement disbursement = disbursementRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Disbursement not found with id: " + id));

		return mapToResponse(disbursement);
	}

	// GET ALL
	public List<DisbursementResponseDTO> getAllDisbursements() {

		return disbursementRepository.findAll().stream().map(this::mapToResponse).toList();
	}

	// UPDATE BY ID
	public DisbursementResponseDTO updateDisbursementById(Long id, DisbursementUpdateRequestDTO request) {

		Disbursement existingDisbursement = disbursementRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Disbursement not found with id: " + id));

		// Update Application
		if (request.getApplicationId() != null) {

			Application application = applicationRepository.findById(request.getApplicationId())
					.orElseThrow(() -> new ResourceNotFoundException(
							"Application not found with id: " + request.getApplicationId()));

			existingDisbursement.setApplication(application);
		}

		// Update Installment Number
		if (request.getInstallmentNumber() != null) {

			existingDisbursement.setInstallmentNumber(request.getInstallmentNumber());
		}

		// Update Amount
		if (request.getAmount() != null) {

			existingDisbursement.setAmount(request.getAmount());
		}

		// Update Status
		if (request.getStatus() != null) {

			existingDisbursement.setStatus(request.getStatus());
		}

		// Update Transaction Reference
		if (request.getTransactionReference() != null) {

			existingDisbursement.setTransactionReference(request.getTransactionReference());
		}

		// Update Remarks
		if (request.getRemarks() != null) {

			existingDisbursement.setRemarks(request.getRemarks());
		}

		Disbursement updatedDisbursement = disbursementRepository.save(existingDisbursement);

		return mapToResponse(updatedDisbursement);
	}

	// DELETE BY ID
	public void deleteDisbursementById(Long id) {

		Disbursement disbursement = disbursementRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Disbursement not found with id: " + id));

		disbursementRepository.delete(disbursement);
	}

	// ENTITY → RESPONSE DTO
	private DisbursementResponseDTO mapToResponse(Disbursement disbursement) {

		DisbursementResponseDTO response = new DisbursementResponseDTO();

		response.setId(disbursement.getId());

		response.setApplicationId(disbursement.getApplication().getId());

		response.setInstallmentNumber(disbursement.getInstallmentNumber());

		response.setAmount(disbursement.getAmount());

		response.setDisbursementDate(disbursement.getDisbursementDate());

		response.setStatus(disbursement.getStatus());

		response.setTransactionReference(disbursement.getTransactionReference());

		response.setRemarks(disbursement.getRemarks());

		return response;
	}
}