package com.subsidy.subsidyDisbursement.approval.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.subsidy.subsidyDisbursement.approval.dto.ApprovalRequestDTO;
import com.subsidy.subsidyDisbursement.approval.dto.ApprovalResponseDTO;
import com.subsidy.subsidyDisbursement.approval.dto.ApprovalUpdateRequestDTO;
import com.subsidy.subsidyDisbursement.approval.entity.Approval;
import com.subsidy.subsidyDisbursement.approval.entity.ApprovalStatus;
import com.subsidy.subsidyDisbursement.approval.repository.ApprovalRepository;

import com.subsidy.subsidyDisbursement.application.entity.Application;
import com.subsidy.subsidyDisbursement.application.entity.ApplicationStatus;
import com.subsidy.subsidyDisbursement.application.repository.ApplicationRepository;

import com.subsidy.subsidyDisbursement.user.entity.User;
import com.subsidy.subsidyDisbursement.user.repository.UserRepository;

import com.subsidy.subsidyDisbursement.exception.BusinessException;
import com.subsidy.subsidyDisbursement.exception.ResourceNotFoundException;

@Service
public class ApprovalService {

	private final ApprovalRepository arepo;
	private final ApplicationRepository apprepo;
	private final UserRepository urepo;

	public ApprovalService(ApprovalRepository arepo, ApplicationRepository apprepo, UserRepository urepo) {

		this.arepo = arepo;
		this.apprepo = apprepo;
		this.urepo = urepo;
	}

	// CREATE
	public ApprovalResponseDTO createApproval(ApprovalRequestDTO request) {

		User user = urepo.findById(request.getApprovedById()).orElseThrow(
				() -> new ResourceNotFoundException("User not found with id: " + request.getApprovedById()));

		Application application = apprepo.findById(request.getApplicationId()).orElseThrow(
				() -> new ResourceNotFoundException("Application not found with id: " + request.getApplicationId()));

		// Application must be VERIFIED before approval
		if (application.getStatus() != ApplicationStatus.VERIFIED) {
			throw new BusinessException("Application must be VERIFIED before approval");
		}

		// Update application status based on approval decision
		if (request.getStatus() == ApprovalStatus.APPROVED) {

			application.setStatus(ApplicationStatus.APPROVED);

		} else if (request.getStatus() == ApprovalStatus.REJECTED) {

			application.setStatus(ApplicationStatus.REJECTED);
		}

		Approval approval = new Approval();

		approval.setApplication(application);
		approval.setApprovedBy(user);
		approval.setStatus(request.getStatus());
		approval.setApprovedAmount(request.getApprovedAmount());
		approval.setDecisionDate(LocalDateTime.now());
		approval.setRemarks(request.getRemarks());

		apprepo.save(application);

		Approval savedApproval = arepo.save(approval);

		return mapToResponse(savedApproval);
	}

	// GET BY ID
	public ApprovalResponseDTO getApprovalById(Long id) {

		Approval approval = arepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Approval not found with id: " + id));

		return mapToResponse(approval);
	}

	// GET ALL
	public List<ApprovalResponseDTO> getAllApprovals() {

		return arepo.findAll().stream().map(this::mapToResponse).toList();
	}

	// UPDATE BY ID
	public ApprovalResponseDTO updateApprovalById(Long id, ApprovalUpdateRequestDTO request) {

		Approval existingApproval = arepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Approval not found with id: " + id));

		// Update Application
		if (request.getApplicationId() != null) {

			Application application = apprepo.findById(request.getApplicationId())
					.orElseThrow(() -> new ResourceNotFoundException(
							"Application not found with id: " + request.getApplicationId()));

			existingApproval.setApplication(application);
		}

		// Update Approver
		if (request.getApprovedById() != null) {

			User user = urepo.findById(request.getApprovedById()).orElseThrow(
					() -> new ResourceNotFoundException("User not found with id: " + request.getApprovedById()));

			existingApproval.setApprovedBy(user);
		}

		// Update Status
		if (request.getStatus() != null) {
			existingApproval.setStatus(request.getStatus());
			
			// Update application status based on approval decision
			if (request.getStatus() == ApprovalStatus.APPROVED) {

				existingApproval.getApplication().setStatus(ApplicationStatus.APPROVED);

			} else if (request.getStatus() == ApprovalStatus.REJECTED) {

				existingApproval.getApplication().setStatus(ApplicationStatus.REJECTED);
			}
		}

		// Update Approved Amount
		if (request.getApprovedAmount() != null) {
			existingApproval.setApprovedAmount(request.getApprovedAmount());
		}

		// Update Remarks
		if (request.getRemarks() != null) {
			existingApproval.setRemarks(request.getRemarks());
		}

		// Update decision date whenever approval is modified
		existingApproval.setDecisionDate(LocalDateTime.now());
		
		apprepo.save(existingApproval.getApplication());
									
		Approval updatedApproval = arepo.save(existingApproval);

		return mapToResponse(updatedApproval);
	}

	// DELETE BY ID
	public void deleteApprovalById(Long id) {

		Approval approval = arepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Approval not found with id: " + id));

		arepo.delete(approval);
	}

	// ENTITY → RESPONSE DTO
	private ApprovalResponseDTO mapToResponse(Approval approval) {

		ApprovalResponseDTO response = new ApprovalResponseDTO();

		response.setId(approval.getId());

		response.setApplicationId(approval.getApplication().getId());

		response.setApprovedById(approval.getApprovedBy().getId());

		response.setStatus(approval.getStatus());

		response.setApprovedAmount(approval.getApprovedAmount());

		response.setDecisionDate(approval.getDecisionDate());

		response.setRemarks(approval.getRemarks());

		return response;
	}
}