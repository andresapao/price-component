package com.totvs.agro.pricecomponent.enumvalidators;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class UnitOfMeasureValidator implements ConstraintValidator<UnitOfMeasureSubset, Integer> {
	private List<Integer> acceptedValues;
	@Override
	public void initialize(UnitOfMeasureSubset constraintAnnotation) {
	    acceptedValues = Stream.of(constraintAnnotation.enumClass().getEnumConstants())
                .map(Enum::ordinal)
                .collect(Collectors.toList());	}
	@Override
	public boolean isValid(Integer value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
 
        return acceptedValues.contains(value);		
	}
}

