package com.totvs.agro.pricecomponent.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.totvs.agro.pricecomponent.model.PriceComponentModel;
import com.totvs.agro.pricecomponent.repository.PriceComponentRepository;
import com.totvs.tjf.api.context.stereotype.ApiError;
import com.totvs.tjf.api.context.stereotype.ApiGuideline;
import com.totvs.tjf.api.context.stereotype.ApiGuideline.ApiGuidelineVersion;
import com.totvs.tjf.api.context.v2.request.ApiExpandRequest;
import com.totvs.tjf.api.context.v2.request.ApiFieldRequest;
import com.totvs.tjf.api.context.v2.request.ApiPageRequest;
import com.totvs.tjf.api.context.v2.request.ApiSortRequest;
import com.totvs.tjf.api.context.v2.response.ApiCollectionResponse;
import com.totvs.tjf.api.validation.stereotype.ApiValid;
import com.totvs.tjf.api.validation.stereotype.ApiValidated;


@CrossOrigin
@RestController
@RequestMapping(path = "/api/v1", produces = MediaType.APPLICATION_JSON_VALUE)
@ApiGuideline(ApiGuidelineVersion.V2)
@ApiValidated(status = HttpStatus.BAD_REQUEST)
@ApiError
public class PriceComponentController {


	@Autowired
	private PriceComponentRepository priceRepo;

	@GetMapping
	public ApiCollectionResponse<PriceComponentModel> getAll(ApiExpandRequest expandRequest, ApiFieldRequest field, ApiPageRequest page, ApiSortRequest sort) {
		
		var collect = priceRepo.findAll(page, sort).getItems();
		if(expandRequest.getExpand().contains("products"))
		{
			collect.forEach(item->item.getProducts().size());			
		}
		if(expandRequest.getExpand().contains("finality"))
		{
			collect.forEach(item->item.getFinality().size());
		}
		if(expandRequest.getExpand().contains("components"))
		{
			collect.forEach(item->item.getComponents().size());
		}
		if(expandRequest.getExpand().contains("freights"))
		{
			collect.forEach(item->item.getFreights().size());
		}		
		
		return ApiCollectionResponse.from(collect);
	}

	@GetMapping("/{id}")
	public PriceComponentModel getOne(@PathVariable(required = true) int id, ApiExpandRequest expandRequest) {
		var collect = priceRepo.findById(id).orElse(null);
		
		if(expandRequest.getExpand().contains("products"))
		{
			collect.getProducts().size();			
		}
		if(expandRequest.getExpand().contains("finality"))
		{
			collect.getFinality().size();
		}
		if(expandRequest.getExpand().contains("components"))
		{
			collect.getComponents().size();
		}
		if(expandRequest.getExpand().contains("freights"))
		{
			collect.getFreights().size();
		}

		return collect;
	}

	@PostMapping
	public PriceComponentModel add(@RequestBody @ApiValid PriceComponentModel priceComponent) {
		return priceRepo.saveAndFlush(priceComponent);
	}
	
	@PutMapping("/{id}")
	public PriceComponentModel update(@PathVariable(required = true) int id, @RequestBody @ApiValid PriceComponentModel priceComponent) {
		return priceRepo.saveAndFlush(priceComponent);
	}
	
	@DeleteMapping("/{id}")
	public boolean delete(@PathVariable(required = true) int id) {
		priceRepo.deleteById(id);	
		return true;
	}	
}
