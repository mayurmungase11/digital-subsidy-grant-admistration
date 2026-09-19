package com.subsidy.subsidyDisbursement.district.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.subsidy.subsidyDisbursement.district.dto.DistrictRequestDTO;
import com.subsidy.subsidyDisbursement.district.dto.DistrictResponseDTO;
import com.subsidy.subsidyDisbursement.district.dto.DistrictUpdateRequestDTO;
import com.subsidy.subsidyDisbursement.district.entity.District;
import com.subsidy.subsidyDisbursement.district.repository.DistrictRepository;
import com.subsidy.subsidyDisbursement.state.entity.State;
import com.subsidy.subsidyDisbursement.state.repository.StateRepository;

@Service
public class DistrictService {

    private final DistrictRepository drepo;
    private final StateRepository srepo;

    public DistrictService(DistrictRepository repo, StateRepository srepo) {
        this.drepo = repo;
        this.srepo = srepo;
    }

    // CREATE
    public DistrictResponseDTO createDistrict(DistrictRequestDTO request) {

        State state = srepo.findById(request.getStateId())
                .orElseThrow(() -> new RuntimeException("State Not Found"));

        District district = new District();

        district.setName(request.getName());
        district.setState(state);

        District savedDistrict = drepo.save(district);

        return mapToResponse(savedDistrict);
    }

    // GET BY ID
    public DistrictResponseDTO getDistrictById(Long id) {

        District district = drepo.findById(id)
                .orElseThrow(() -> new RuntimeException("District not found"));

        return mapToResponse(district);
    }

    // GET ALL
    public List<DistrictResponseDTO> getAllDistricts() {

        return drepo.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // UPDATE
    public DistrictResponseDTO updateDistrict(
            DistrictUpdateRequestDTO request,
            Long id) {

        District district = drepo.findById(id)
                .orElseThrow(() -> new RuntimeException("District Not Found"));

        if (request.getName() != null) {
            district.setName(request.getName());
        }

        if (request.getStateId() != null) {

            State state = srepo.findById(request.getStateId())
                    .orElseThrow(() -> new RuntimeException("State Not Found"));

            district.setState(state);
        }

        District updatedDistrict = drepo.save(district);

        return mapToResponse(updatedDistrict);
    }

    // DELETE
    public void deleteDistrictById(Long id) {

        drepo.deleteById(id);
    }

    // ENTITY → RESPONSE DTO
    private DistrictResponseDTO mapToResponse(District district) {

        DistrictResponseDTO response = new DistrictResponseDTO();

        response.setId(district.getId());
        response.setName(district.getName());

        if (district.getState() != null) {
            response.setStateId(district.getState().getId());
            response.setStateName(district.getState().getName());
        }

        return response;
    }
}