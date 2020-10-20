package com.totvs.agro.pricecomponent.model;


import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;



import com.sun.istack.NotNull;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.NonNull;

@Getter
@Setter
@Entity(name = "PriceComponent")
@NoArgsConstructor
@Table(name = "price_component")

public class PriceComponentModel {
	@Id
	@NotNull
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@NotNull
	@Column(name = "code")
	private String code;

	@NonNull
	@Column(name = "description")
	private String desc;

	@NotNull
	@Column(name = "currency")
	private String currency;

	@javax.validation.constraints.NotNull(message = "O campo de unidade deve ser informado")
	@Column(name = "measure_unit")
	private String un;

	@Column(name = "external_code")
	private String extCode;

	@Column(name = "type")
	private Integer type;

	@Column(name = "price_table")
	private String table;

	@Column(name = "application")
	private Integer application;
	
	@Column(name = "active")
	private Boolean active;	

	@Column(name = "hedge")
	private Boolean hedge;	
	
	@OneToMany(fetch=FetchType.LAZY, cascade=CascadeType.ALL)
	@NotNull
	private List<PriceItemModel> products;
	
	@OneToMany(fetch=FetchType.LAZY, cascade=CascadeType.ALL)
	@NotNull
	private List<ComponentPurposeModel> components;
	
	@OneToMany(fetch=FetchType.LAZY, cascade=CascadeType.PERSIST)	
	@NotNull
	private List<ComponentUnitModel> finality;

	@OneToMany(fetch=FetchType.LAZY, cascade=CascadeType.PERSIST)
	@NotNull
	private List<FreightageComponentModel> freights;

}
