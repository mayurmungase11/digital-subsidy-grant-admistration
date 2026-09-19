package com.subsidy.subsidyDisbursement.eligibility.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.subsidy.subsidyDisbursement.application.entity.Application;
import com.subsidy.subsidyDisbursement.application.entity.ApplicationStatus;
import com.subsidy.subsidyDisbursement.application.repository.ApplicationRepository;
import com.subsidy.subsidyDisbursement.beneficiary.entity.Beneficiary;
import com.subsidy.subsidyDisbursement.eligibility.dto.EligibilityResult;
import com.subsidy.subsidyDisbursement.eligibilityCriteria.entity.EligibilityCriteria;
import com.subsidy.subsidyDisbursement.eligibilityCriteria.repository.EligibilityCriteriaRepository;

@Service
public class EligibilityService {

	private static final int ELIGIBILITY_THRESHOLD = 50;

	private final ApplicationRepository applicationRepository;
	private final EligibilityCriteriaRepository criteriaRepository;

	public EligibilityService(ApplicationRepository applicationRepository,
			EligibilityCriteriaRepository criterionRepository) {

		this.applicationRepository = applicationRepository;
		this.criteriaRepository = criterionRepository;
	}

	public EligibilityResult evaluateApplication(Long id) {

		Application application = applicationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Application not found"));

		Beneficiary beneficiary= application.getBeneficiary();

		Long schemeId = application.getScheme().getId();

		List<EligibilityCriteria> criteria = criteriaRepository.findBySchemeId(schemeId);

		int score = 0;

		for (EligibilityCriteria cr : criteria) {

			boolean passed = evaluateCriteria(cr, beneficiary);

			if (passed) {
				score += cr.getScore();
			}
		}

		boolean eligible = score >= ELIGIBILITY_THRESHOLD;

		String message = eligible ? "Beneficiary is eligible" : "Beneficiary is not eligible";
		
		//for auto status update based on eligibility

		if (eligible) {

			application.setStatus(ApplicationStatus.UNDER_VERIFICATION);

		} else {

			application.setStatus(ApplicationStatus.REJECTED);
		}

		applicationRepository.save(application);

		return new EligibilityResult(eligible, score, ELIGIBILITY_THRESHOLD, message);
	}

	private boolean evaluateCriteria(EligibilityCriteria criteria, Beneficiary beneficiary) {

		String field = criteria.getField();
		String operator = criteria.getOperator();
		double expectedValue = Double.parseDouble(criteria.getExpectedValue());

		double actualValue;

		if ("age".equalsIgnoreCase(field)) {

			actualValue = beneficiary.getAge();

		} else if ("annualIncome".equalsIgnoreCase(field)) {

			actualValue = beneficiary.getAnnualIncome();

		} else {

			return false;
		}

		return compare(actualValue, operator, expectedValue);
	}

	private boolean compare(double actual, String operator, double expected) {

		return switch (operator) {

		case ">" -> actual > expected;

		case ">=" -> actual >= expected;

		case "<" -> actual < expected;

		case "<=" -> actual <= expected;

		case "=" -> actual == expected;

		default -> false;
		};
	}
}