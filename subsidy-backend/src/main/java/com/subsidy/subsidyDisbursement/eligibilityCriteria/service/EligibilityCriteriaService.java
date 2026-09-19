package com.subsidy.subsidyDisbursement.eligibilityCriteria.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.subsidy.subsidyDisbursement.eligibilityCriteria.dto.EligibilityCriteriaRequestDTO;
import com.subsidy.subsidyDisbursement.eligibilityCriteria.dto.EligibilityCriteriaResponseDTO;
import com.subsidy.subsidyDisbursement.eligibilityCriteria.dto.EligibilityCriteriaUpdateRequestDTO;
import com.subsidy.subsidyDisbursement.eligibilityCriteria.entity.EligibilityCriteria;
import com.subsidy.subsidyDisbursement.eligibilityCriteria.repository.EligibilityCriteriaRepository;
import com.subsidy.subsidyDisbursement.scheme.entity.Scheme;
import com.subsidy.subsidyDisbursement.scheme.repository.SchemeRepository;

@Service
public class EligibilityCriteriaService {

    private final EligibilityCriteriaRepository elrepo;
    private final SchemeRepository srepo;

    public EligibilityCriteriaService(
            EligibilityCriteriaRepository elrepo,
            SchemeRepository srepo) {

        this.elrepo = elrepo;
        this.srepo = srepo;
    }

    // CREATE
    public EligibilityCriteriaResponseDTO createCriteria(
            EligibilityCriteriaRequestDTO request) {

        Scheme scheme = srepo.findById(request.getSchemeId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Scheme not found with id: "
                                        + request.getSchemeId()
                        )
                );

        EligibilityCriteria criteria = new EligibilityCriteria();

        criteria.setScheme(scheme);
        criteria.setField(request.getField());
        criteria.setOperator(request.getOperator());
        criteria.setExpectedValue(request.getExpectedValue());
        criteria.setMandatory(request.getMandatory());
        criteria.setScore(request.getScore());

        EligibilityCriteria savedCriteria = elrepo.save(criteria);

        return convertToResponseDTO(savedCriteria);
    }

    // GET BY ID
    public EligibilityCriteriaResponseDTO getCriteriaById(Long id) {

        EligibilityCriteria criteria = elrepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Eligibility criteria not found with id: "
                                        + id
                        )
                );

        return convertToResponseDTO(criteria);
    }

    // GET ALL
    public List<EligibilityCriteriaResponseDTO> getAllCriteria() {

        return elrepo.findAll()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // UPDATE
    public EligibilityCriteriaResponseDTO updateCriteria(
            Long id,
            EligibilityCriteriaUpdateRequestDTO updatedCriteria) {

        EligibilityCriteria existingCriteria = elrepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Eligibility criteria not found with id: "
                                        + id
                        )
                );

        if (updatedCriteria.getSchemeId() != null) {

            Scheme scheme = srepo.findById(
                    updatedCriteria.getSchemeId()
            ).orElseThrow(() ->
                    new RuntimeException(
                            "Scheme not found with id: "
                                    + updatedCriteria.getSchemeId()
                    )
            );

            existingCriteria.setScheme(scheme);
        }

        if (updatedCriteria.getField() != null) {
            existingCriteria.setField(
                    updatedCriteria.getField()
            );
        }

        if (updatedCriteria.getOperator() != null) {
            existingCriteria.setOperator(
                    updatedCriteria.getOperator()
            );
        }

        if (updatedCriteria.getExpectedValue() != null) {
            existingCriteria.setExpectedValue(
                    updatedCriteria.getExpectedValue()
            );
        }

        if (updatedCriteria.getMandatory() != null) {
            existingCriteria.setMandatory(
                    updatedCriteria.getMandatory()
            );
        }

        if (updatedCriteria.getScore() != null) {
            existingCriteria.setScore(
                    updatedCriteria.getScore()
            );
        }

        EligibilityCriteria savedCriteria =
                elrepo.save(existingCriteria);

        return convertToResponseDTO(savedCriteria);
    }

    // DELETE
    public void deleteCriteria(Long id) {

        if (!elrepo.existsById(id)) {
            throw new RuntimeException(
                    "Eligibility criteria not found with id: " + id
            );
        }

        elrepo.deleteById(id);
    }

    // ENTITY → RESPONSE DTO
    private EligibilityCriteriaResponseDTO convertToResponseDTO(
            EligibilityCriteria criteria) {

        return new EligibilityCriteriaResponseDTO(
                criteria.getId(),
                criteria.getScheme().getId(),
                criteria.getField(),
                criteria.getOperator(),
                criteria.getExpectedValue(),
                criteria.getMandatory(),
                criteria.getScore()
        );
    }
}