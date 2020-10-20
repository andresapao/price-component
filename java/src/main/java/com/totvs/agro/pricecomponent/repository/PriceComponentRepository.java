package com.totvs.agro.pricecomponent.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.totvs.agro.pricecomponent.model.PriceComponentModel;
import com.totvs.tjf.api.jpa.repository.ApiJpaRepository;


@Repository
@Transactional
public interface PriceComponentRepository extends JpaRepository<PriceComponentModel, Integer>, ApiJpaRepository<PriceComponentModel>   {

}
