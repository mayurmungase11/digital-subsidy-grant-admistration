package com.subsidy.subsidyDisbursement.verification.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.subsidy.subsidyDisbursement.application.entity.Application;
import com.subsidy.subsidyDisbursement.application.entity.ApplicationStatus;
import com.subsidy.subsidyDisbursement.application.repository.ApplicationRepository;
import com.subsidy.subsidyDisbursement.exception.BusinessRuleException;
import com.subsidy.subsidyDisbursement.exception.ResourceNotFoundException;
import com.subsidy.subsidyDisbursement.user.entity.User;
import com.subsidy.subsidyDisbursement.user.repository.UserRepository;
import com.subsidy.subsidyDisbursement.verification.dto.VerificationRequestDTO;
import com.subsidy.subsidyDisbursement.verification.dto.VerificationResponseDTO;
import com.subsidy.subsidyDisbursement.verification.dto.VerificationUpdateRequestDTO;
import com.subsidy.subsidyDisbursement.verification.entity.Verification;
import com.subsidy.subsidyDisbursement.verification.entity.VerificationStatus;
import com.subsidy.subsidyDisbursement.verification.repository.VerificationRepository;

@Service
public class VerificationService {

	private final VerificationRepository vrepo;
	private final ApplicationRepository arepo;
	private final UserRepository urepo;

	public VerificationService(VerificationRepository vrepo, ApplicationRepository arepo, UserRepository urepo) {

		this.vrepo = vrepo;
		this.arepo = arepo;
		this.urepo = urepo;
	}

	// CREATE
	public VerificationResponseDTO createVerification(VerificationRequestDTO request) {

		Application application = arepo.findById(request.getApplicationId()).orElseThrow(
				() -> new ResourceNotFoundException("Application not found with id: " + request.getApplicationId()));

		User user = urepo.findById(request.getVerifiedById()).orElseThrow(
				() -> new ResourceNotFoundException("User not found with id: " + request.getVerifiedById()));

		if (application.getStatus() != ApplicationStatus.UNDER_VERIFICATION) {

			throw new BusinessRuleException("Application is not ready for verification");
		}

		Verification verification = new Verification();

		verification.setApplication(application);
		verification.setVerifiedBy(user);
		verification.setStatus(request.getStatus());
		verification.setVerifiedAt(LocalDateTime.now());
		verification.setRemarks(request.getRemarks());

		// Automatically update application status
		if (request.getStatus() == VerificationStatus.VERIFIED) {

			application.setStatus(ApplicationStatus.VERIFIED);

		} else if (request.getStatus() == VerificationStatus.REJECTED) {

			application.setStatus(ApplicationStatus.REJECTED);
		}

		arepo.save(application);

		Verification savedVerification = vrepo.save(verification);

		return mapToResponse(savedVerification);
	}

	// GET BY ID
	public VerificationResponseDTO getVerificationById(Long id) {

		Verification verification = vrepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Verification not found with id: " + id));

		return mapToResponse(verification);
	}

	// GET ALL
	public List<VerificationResponseDTO> getAllVerifications() {

		return vrepo.findAll().stream().map(this::mapToResponse).toList();
	}

	// UPDATE
	public VerificationResponseDTO updateVerificationById(Long id, VerificationUpdateRequestDTO request) {

		Verification existingVerification = vrepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Verification not found with id: " + id));

		if (request.getApplicationId() != null) {

			Application application = arepo.findById(request.getApplicationId())
					.orElseThrow(() -> new ResourceNotFoundException(
							"Application not found with id: " + request.getApplicationId()));

			existingVerification.setApplication(application);
		}

		if (request.getVerifiedById() != null) {

			User user = urepo.findById(request.getVerifiedById()).orElseThrow(
					() -> new ResourceNotFoundException("User not found with id: " + request.getVerifiedById()));

			existingVerification.setVerifiedBy(user);
		}

		if (request.getStatus() != null) {

			Application application = existingVerification.getApplication();

			existingVerification.setStatus(request.getStatus());

			// Automatically update application status
			if (request.getStatus() == VerificationStatus.VERIFIED) {

				application.setStatus(ApplicationStatus.VERIFIED);

			} else if (request.getStatus() == VerificationStatus.REJECTED) {

				application.setStatus(ApplicationStatus.REJECTED);
			}

			arepo.save(application);
		}

		if (request.getVerifiedAt() != null) {

			existingVerification.setVerifiedAt(request.getVerifiedAt());
		}

		if (request.getRemarks() != null) {

			existingVerification.setRemarks(request.getRemarks());
		}

		Verification updatedVerification = vrepo.save(existingVerification);

		return mapToResponse(updatedVerification);
	}

	// DELETE
	public void deleteVerificationById(Long id) {

		Verification verification = vrepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Verification not found with id: " + id));

		vrepo.delete(verification);
	}

	// ENTITY → RESPONSE DTO
	private VerificationResponseDTO mapToResponse(Verification verification) {

		VerificationResponseDTO response = new VerificationResponseDTO();

		response.setId(verification.getId());

		if (verification.getApplication() != null) {
			response.setApplicationId(verification.getApplication().getId());
		}

		if (verification.getVerifiedBy() != null) {
			response.setVerifiedById(verification.getVerifiedBy().getId());
		}

		response.setStatus(verification.getStatus());
		response.setVerifiedAt(verification.getVerifiedAt());
		response.setRemarks(verification.getRemarks());

		return response;
	}
}