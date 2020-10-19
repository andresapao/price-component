import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PoModule, PoI18nPipe, PoI18nService, PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';

import { PriceComponentService } from '../shared/services/price-component.service';
import { PriceComponentEditComponent } from './edit/price-component.edit.component';
import { PriceComponentListComponent } from './price-component.list.component';
import { PriceComponentRoutingModule } from './price-component-routing.module';
import { priceComponentPt } from '../shared/literals/i18n/price-component-pt';
import { priceComponentEn } from '../shared/literals/i18n/price-component-en';
import { priceComponentEs } from '../shared/literals/i18n/price-component-es';
import { generalPt } from '../shared/literals/i18n/general-pt';
import { generalEn } from '../shared/literals/i18n/general-en';
import { generalEs } from '../shared/literals/i18n/general-es';

const i18nConfig: PoI18nConfig = {
  default: {
    context: 'general',
    cache: true,
    language: navigator.language
  },
  contexts: {
    general: {
      'pt-BR': generalPt,
      'en-US': generalEn,
      'es': generalEs
    },
    priceComponent: {
      'pt-BR': priceComponentPt,
      'en-US': priceComponentEn,
      'es': priceComponentEs
    }
  }
};

@NgModule({
  imports: [
    CommonModule,
    PoModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PriceComponentRoutingModule,
    PoI18nModule.config(i18nConfig)
  ],
  declarations: [
    PriceComponentListComponent,
    PriceComponentEditComponent
  ],
  exports: [
    PriceComponentListComponent
  ],
  providers: [
    PoI18nPipe,
    PriceComponentService
  ],
})
export class PriceComponentModule { }

