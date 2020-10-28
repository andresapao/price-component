package com.totvs.agro.pricecomponent.model;


import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import com.totvs.agro.pricecomponent.enumvalidators.UnitOfMeasureSubset;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@Entity(name = "PriceComponent")
@NoArgsConstructor
@Table(name = "price_component")

public class PriceComponentModel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@NotNull
	@Column(name = "code", unique = true)
	private String code;

	@NotNull
	@Column(name = "description")
	private String desc;

	@NotNull
	@Enumerated
	@Column(name = "currency")
	private CurrencyEnum currency;

	@Column(name = "measure_unit")
	@UnitOfMeasureSubset(enumClass = UnitOfMeasureEnum.class)
	private Integer unitOfMeasure;

	@Column(name = "external_code")
	private String externalCode;

	@Column(name = "type")
	private Integer type;

	@Column(name = "price_table")
	private String priceTable;

	@Column(name = "application")
	private Integer application;
	
	@Column(name = "active")
	private Boolean active;	

	@Column(name = "hedge")
	private Boolean hedge;	
	
//	@JsonProperty(access = Access.WRITE_ONLY)
	@OneToMany(cascade=CascadeType.ALL)
	@JoinColumn(name="item_id")
	@NotNull
	private List<PriceItemModel> products;
	
//	@JsonProperty(access = Access.WRITE_ONLY)	
	@ManyToMany(fetch=FetchType.LAZY, cascade=CascadeType.PERSIST)
	@NotNull
	 @JoinTable(name = "component_price_finalities",
     joinColumns = @JoinColumn(name = "price_component_id"),
     inverseJoinColumns = @JoinColumn(name = "finality_id"),
     uniqueConstraints = {
	 @UniqueConstraint(name = "UK_price_component_finality",
	    columnNames = {"finality_id", "price_component_id"})})	
	private List<ComponentPurposeModel> finality;
	
//	@JsonProperty(access = Access.WRITE_ONLY)	
	@OneToMany(fetch=FetchType.LAZY, cascade=CascadeType.PERSIST)
	@NotNull
	private List<ComponentUnitModel> components;

//	@JsonProperty(access = Access.WRITE_ONLY)	
	@OneToMany(fetch=FetchType.LAZY, cascade=CascadeType.PERSIST)
	@NotNull
	private List<FreightageComponentModel> freights;
	
}
