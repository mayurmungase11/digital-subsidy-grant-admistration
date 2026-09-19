package com.subsidy.subsidyDisbursement.application.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.subsidy.subsidyDisbursement.application.dto.ApplicationRequestDTO;
import com.subsidy.subsidyDisbursement.application.dto.ApplicationResponseDTO;
import com.subsidy.subsidyDisbursement.application.dto.ApplicationUpdateRequestDTO;
import com.subsidy.subsidyDisbursement.application.dto.BeneficiaryApplicationRequestDTO;
import com.subsidy.subsidyDisbursement.application.entity.Application;
import com.subsidy.subsidyDisbursement.application.entity.ApplicationStatus;
import com.subsidy.subsidyDisbursement.application.repository.ApplicationRepository;
import com.subsidy.subsidyDisbursement.beneficiary.entity.Beneficiary;
import com.subsidy.subsidyDisbursement.beneficiary.repository.BeneficiaryRepository;
import com.subsidy.subsidyDisbursement.scheme.entity.Scheme;
import com.subsidy.subsidyDisbursement.scheme.repository.SchemeRepository;
import com.subsidy.subsidyDisbursement.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository arepo;

    private final SchemeRepository srepo;

    private final BeneficiaryRepository brepo;

    // ============================================================
    // CREATE - ADMIN / FIELD OFFICER
    // ============================================================

    public ApplicationResponseDTO createApplication(ApplicationRequestDTO request) {

        Beneficiary beneficiary = brepo.findById(request.getBeneficiaryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Beneficiary not found with id: " + request.getBeneficiaryId()));

        Scheme scheme = srepo.findById(request.getSchemeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Scheme not found with id: " + request.getSchemeId()));

        Application application = new Application();

        application.setBeneficiary(beneficiary);

        application.setScheme(scheme);

        application.setRequestedAmount(request.getRequestedAmount());

        // New applications always start with SUBMITTED status
        application.setStatus(ApplicationStatus.SUBMITTED);

        Application savedApplication = arepo.save(application);

        return mapToResponse(savedApplication);
    }

    // ============================================================
    // CREATE - LOGGED-IN BENEFICIARY
    // ============================================================

    public ApplicationResponseDTO createApplicationForBeneficiary(
            BeneficiaryApplicationRequestDTO request) {

        // Get beneficiary from logged-in JWT user
        Beneficiary beneficiary = getLoggedInBeneficiary();

        // Find requested scheme
        Scheme scheme = srepo.findById(request.getSchemeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Scheme not found with id: " + request.getSchemeId()));

        // Create application
        Application application = new Application();

        application.setBeneficiary(beneficiary);

        application.setScheme(scheme);

        application.setRequestedAmount(request.getRequestedAmount());

        // New applications always start with SUBMITTED
        application.setStatus(ApplicationStatus.SUBMITTED);

        Application savedApplication = arepo.save(application);

        return mapToResponse(savedApplication);
    }

    // ============================================================
    // GET BY ID
    // ============================================================

    public ApplicationResponseDTO getApplicationById(Long id) {

        Application application = arepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with id: " + id));

        return mapToResponse(application);
    }

    // ============================================================
    // GET ALL
    // ============================================================

    public List<ApplicationResponseDTO> getAllApplications() {

        return arepo.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    
 // GET MY APPLICATIONS - LOGGED-IN BENEFICIARY
    public List<ApplicationResponseDTO> getMyApplications() {

        Beneficiary beneficiary = getLoggedInBeneficiary();

        return arepo.findByBeneficiaryId(beneficiary.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ============================================================
    // UPDATE
    // ============================================================

    public ApplicationResponseDTO updateApplicationById(
            Long id,
            ApplicationUpdateRequestDTO request) {

        Application existingApplication = arepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with id: " + id));

        if (request.getBeneficiaryId() != null) {

            Beneficiary beneficiary = brepo.findById(
                    request.getBeneficiaryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Beneficiary not found with id: "
                                    + request.getBeneficiaryId()));

            existingApplication.setBeneficiary(beneficiary);
        }

        if (request.getSchemeId() != null) {

            Scheme scheme = srepo.findById(
                    request.getSchemeId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Scheme not found with id: "
                                    + request.getSchemeId()));

            existingApplication.setScheme(scheme);
        }

        if (request.getRequestedAmount() != null) {

            existingApplication.setRequestedAmount(
                    request.getRequestedAmount());
        }

        if (request.getStatus() != null) {

            existingApplication.setStatus(
                    request.getStatus());
        }

        Application updatedApplication =
                arepo.save(existingApplication);

        return mapToResponse(updatedApplication);
    }

    // ============================================================
    // DELETE
    // ============================================================

    public void deleteApplicationById(Long id) {

        Application application = arepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with id: " + id));

        arepo.delete(application);
    }

    // ============================================================
    // JWT → LOGGED-IN USER EMAIL
    // ============================================================

    private String getLoggedInUserEmail() {

        Authentication authentication =
                SecurityContextHolder.getContext()
                        .getAuthentication();

        return authentication.getName();
    }

    // ============================================================
    // LOGGED-IN USER → BENEFICIARY
    // ============================================================

    private Beneficiary getLoggedInBeneficiary() {

        String email = getLoggedInUserEmail();

        return brepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Beneficiary profile not found for user: "
                                + email));
    }

    // ============================================================
    // ENTITY → RESPONSE DTO
    // ============================================================

    private ApplicationResponseDTO mapToResponse(
            Application application) {

        ApplicationResponseDTO response =
                new ApplicationResponseDTO();

        response.setId(application.getId());

        response.setBeneficiaryId(
                application.getBeneficiary().getId());

        response.setSchemeId(
                application.getScheme().getId());

        response.setRequestedAmount(
                application.getRequestedAmount());

        response.setStatus(
                application.getStatus());

        return response;
    }
}