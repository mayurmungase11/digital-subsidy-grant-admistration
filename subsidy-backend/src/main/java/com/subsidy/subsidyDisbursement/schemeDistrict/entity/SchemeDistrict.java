package com.subsidy.subsidyDisbursement.schemeDistrict.entity;

import com.subsidy.subsidyDisbursement.district.entity.District;
import com.subsidy.subsidyDisbursement.scheme.entity.Scheme;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(
	    name = "scheme_districts",
	    uniqueConstraints = {
	        @UniqueConstraint(columnNames = {"scheme_id", "district_id"})
	    }
	)
public class SchemeDistrict {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="scheme_id", nullable=false)
	private Scheme scheme;
	
	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="district_id",nullable=false)
	private District district;
}
