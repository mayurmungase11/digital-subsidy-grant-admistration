package com.subsidy.subsidyDisbursement.schemeDistrict.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.subsidy.subsidyDisbursement.district.entity.District;
import com.subsidy.subsidyDisbursement.district.repository.DistrictRepository;
import com.subsidy.subsidyDisbursement.exception.ResourceNotFoundException;
import com.subsidy.subsidyDisbursement.scheme.entity.Scheme;
import com.subsidy.subsidyDisbursement.scheme.repository.SchemeRepository;
import com.subsidy.subsidyDisbursement.schemeDistrict.dto.SchemeDistrictRequestDTO;
import com.subsidy.subsidyDisbursement.schemeDistrict.dto.SchemeDistrictResponseDTO;
import com.subsidy.subsidyDisbursement.schemeDistrict.entity.SchemeDistrict;
import com.subsidy.subsidyDisbursement.schemeDistrict.repository.SchemeDistrictRepository;

@Service
public class SchemeDistrictService {

    private final SchemeDistrictRepository sdrepo;
    private final SchemeRepository srepo;
    private final DistrictRepository drepo;

    public SchemeDistrictService(
            SchemeDistrictRepository repo,
            SchemeRepository srepo,
            DistrictRepository drepo) {

        this.sdrepo = repo;
        this.srepo = srepo;
        this.drepo = drepo;
    }

    // CREATE

    public SchemeDistrictResponseDTO createSchemeDistrict(
            SchemeDistrictRequestDTO request) {

        Scheme scheme = srepo.findById(request.getSchemeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Scheme not found with id: " + request.getSchemeId()));

        District district = drepo.findById(request.getDistrictId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "District not found with id: " + request.getDistrictId()));

        SchemeDistrict schemeDistrict = new SchemeDistrict();

        schemeDistrict.setScheme(scheme);
        schemeDistrict.setDistrict(district);

        SchemeDistrict savedSchemeDistrict = sdrepo.save(schemeDistrict);

        return mapToResponse(savedSchemeDistrict);
    }

    // GET BY ID

    public SchemeDistrictResponseDTO getSchemeDistrictById(Long id) {

        SchemeDistrict schemeDistrict = sdrepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Scheme-District not found with id: " + id));

        return mapToResponse(schemeDistrict);
    }

    // GET ALL

    public List<SchemeDistrictResponseDTO> getAllSchemeDistrict() {

        return sdrepo.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // UPDATE

    public SchemeDistrictResponseDTO updateSchemeDistrictById(
            Long id,
            SchemeDistrictRequestDTO request) {

        SchemeDistrict existing = sdrepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Scheme-District not found with id: " + id));

        if (request.getSchemeId() != null) {

            Scheme scheme = srepo.findById(request.getSchemeId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Scheme not found with id: "
                                    + request.getSchemeId()));

            existing.setScheme(scheme);
        }

        if (request.getDistrictId() != null) {

            District district = drepo.findById(request.getDistrictId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "District not found with id: "
                                    + request.getDistrictId()));

            existing.setDistrict(district);
        }

        SchemeDistrict updatedSchemeDistrict = sdrepo.save(existing);

        return mapToResponse(updatedSchemeDistrict);
    }

    // DELETE

    public void deleteSchemeDistrictById(Long id) {

        SchemeDistrict existing = sdrepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Scheme-District not found with id: " + id));

        sdrepo.delete(existing);
    }

    // ENTITY → RESPONSE DTO

    private SchemeDistrictResponseDTO mapToResponse(
            SchemeDistrict schemeDistrict) {

        SchemeDistrictResponseDTO response =
                new SchemeDistrictResponseDTO();

        response.setId(schemeDistrict.getId());

        if (schemeDistrict.getScheme() != null) {
            response.setSchemeId(
                    schemeDistrict.getScheme().getId());
        }

        if (schemeDistrict.getDistrict() != null) {
            response.setDistrictId(
                    schemeDistrict.getDistrict().getId());
        }

        return response;
    }
}