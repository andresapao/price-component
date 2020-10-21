import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { forkJoin } from 'rxjs';

import {
  PoBreadcrumb, PoModalAction, PoModalComponent,
  PoPageAction, PoI18nService, PoI18nPipe, PoNotificationService, PoTableColumn
} from '@po-ui/ng-components';


import { IPriceComponent, PriceComponent } from '../../shared/model/price-component.model';
import { PriceComponentService } from '../../shared/services/price-component.service';
import { IPriceComponentProducts } from 'src/app/shared/interfaces/products.interface';
import { IPriceComponentFreight } from 'src/app/shared/interfaces/price-component-freight.interface';
import { IPriceComponentFinality } from 'src/app/shared/interfaces/price-component-finality.interface';
import { IPriceComponentComponent } from 'src/app/shared/interfaces/price-component-component.interface';

@Component({
  selector: 'app-edit',
  templateUrl: './price-component.edit.component.html',
  styleUrls: ['./price-component.edit.component.css']
})
export class PriceComponentEditComponent implements OnInit, OnDestroy {

  @ViewChild('modalDelete', { static: false }) modalDelete: PoModalComponent;
  @ViewChild('modalCancel', { static: false }) modalCancel: PoModalComponent;
  @ViewChild('modalProducts', { static: false }) modalProducts: PoModalComponent;
  @ViewChild('modalFreights', { static: false }) modalFreights: PoModalComponent;
  @ViewChild('modalFinalitys', { static: false }) modalFinalitys: PoModalComponent;
  @ViewChild('modalComponents', { static: false }) modalComponents: PoModalComponent;
  @ViewChild('formComponentPrice', { static: true }) formComponentPrice: NgForm;


  confirmDeleteAction: PoModalAction;
  cancelModalAction: PoModalAction;
  exitModalAction: PoModalAction;
  backModalAction: PoModalAction;
  confirmProduct: PoModalAction;
  confirmFreight: PoModalAction;
  confirmFinality: PoModalAction;
  confirmComponent: PoModalAction;

  errorPattern: string;

  newBreadcrumb: PoBreadcrumb;
  editBreadcrumb: PoBreadcrumb;
  modalActions: Array<PoModalAction>;
  newActions: Array<PoPageAction>;
  editActions: Array<PoPageAction>;

  tabProductsColumns: Array<PoTableColumn>;
  tabProductsActions: Array<PoPageAction>;

  tabFreightsColumns: Array<PoTableColumn>;
  tabFreightsActions: Array<PoPageAction>;

  tabFinalitysColumns: Array<PoTableColumn>;
  tabFinalitysActions: Array<PoPageAction>;

  tabComponentsColumns: Array<PoTableColumn>;
  tabComponentsActions: Array<PoPageAction>;

  isPageEdit: boolean;
  priceComponent: IPriceComponent = PriceComponent.empty();

  cCodeProduct: string;
  cCodeComponent: string;
  cCodeFreight: string;
  cCodeFinality: string;
  cOperacComponent: string;

  literals: any = {};

  aProductsList: Array<IPriceComponentProducts>;
  aFreightsList: Array<IPriceComponentFreight>;
  aFinalitysList: Array<IPriceComponentFinality>;
  aComponentsList: Array<IPriceComponentComponent>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private poI18nPipe: PoI18nPipe,
    private poI18nService: PoI18nService,
    private poNotification: PoNotificationService,
    private service: PriceComponentService
  ) { }

  ngOnInit(): void {
    const requests = [
      this.poI18nService.getLiterals(),
      this.poI18nService.getLiterals({ context: 'priceComponent' })
    ];

    forkJoin(requests).subscribe(literals => {
      literals.map(item => Object.assign(this.literals, item));
      this.setupComponents();
      this.get();
    });
  }

  private checkInteractionOnForm(): void {
    if (this.formComponentPrice.dirty === true) {
      this.modalCancel.open();
    } else {
      this.closeModal();
      this.router.navigate(['./priceComponent']);
    }
  }

  private closeModal() {
    this.modalDelete.close();
    this.modalCancel.close();
    this.modalProducts.close();
    this.modalFinalitys.close();
    this.modalFreights.close();
    this.modalComponents.close();
  }

  private get() {
    const id = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
    if (id) {
      this.isPageEdit = true;
      this.service.getById(id, 'products,components,finality,freights').subscribe((item: IPriceComponent) => {
        this.priceComponent = item;
        this.priceComponent.finality.map(x => {
          x = this.aFinalitysList.find(a => a.code === x.code);
        });
        this.priceComponent.freights.map(x => {
          x = this.aFreightsList.find(a => a.code === x.code);
        });
      });
    }
  }

  private create() {
    this.service.create(this.priceComponent).subscribe(() => {
      this.router.navigate(['/priceComponent']);
      this.poNotification.success(this.literals['createdMessage']);
    });
  }

  private update() {
    this.service.update(this.priceComponent).subscribe(() => {
      this.router.navigate(['/priceComponent']);
      this.poNotification.success(this.literals['updatedMessage']);
    });
  }

  private delete() {
    this.service.delete(this.priceComponent.id).subscribe(data => {
      this.router.navigate(['/priceComponent']);
      this.poNotification.success(
        this.poI18nPipe.transform(
          this.literals['excludedMessage'], [this.priceComponent.desc]
        )
      );
    });
  }

  private onConfirmDelete() {
    this.modalDelete.close();
    this.delete();
  }

  private setupComponents() {

    this.confirmDeleteAction = { action: () => this.onConfirmDelete(), label: this.literals['yes'] };

    this.cancelModalAction = { label: this.literals['cancel'], action: this.closeModal.bind(this) };

    this.exitModalAction = { label: this.literals['no'], action: this.closeModal.bind(this) };

    this.backModalAction = { label: this.literals['yes'], action: () => this.router.navigate(['./priceComponent']) };

    this.editActions = [
      { label: this.literals['save'], action: this.update.bind(this, this.priceComponent), disabled: () => this.formComponentPrice.invalid },
      { label: this.literals['remove'], action: () => this.modalDelete.open() },
      { label: this.literals['back'], action: this.checkInteractionOnForm.bind(this) }
    ];

    this.editBreadcrumb = {
      items: [
        { label: this.literals['priceComponent'], link: '/priceComponent' },
        { label: this.literals['edit'], link: '/priceComponent/edit' }
      ]
    };

    this.newActions = [
      { label: this.literals['save'], action: this.create.bind(this), icon: 'po-icon-plus', disabled: () => this.formComponentPrice.invalid },
      { label: this.literals['back'], action: this.checkInteractionOnForm.bind(this) }
    ];

    this.newBreadcrumb = {
      items: [
        { label: this.literals['priceComponent'], link: '/priceComponent' },
        { label: this.literals['new'], link: '/priceComponent/new' }
      ]
    };

    /** Folder de Produtos */
    this.confirmProduct = { action: () => this.onConfirmProduct(), label: this.literals['confirm'] };

    this.tabProductsColumns = [
      { property: 'code', label: this.literals.code, type: 'string' },
      { property: 'desc', label: this.literals.desc, type: 'string' }
    ];

    this.tabProductsActions = [
      { action: this.deleteProducts.bind(this), label: this.literals.remove, icon: 'po-icon-delete' }
    ];

    this.aProductsList = [
      { code: '001', desc: 'Soja', un: 'BUSCHEL' },
      { code: '002', desc: 'Milho', un: 'SACA' },
      { code: '003', desc: 'Trigo', un: 'QUILO' }
    ];

    /** Forder Fretes */
    this.confirmFreight = { action: () => this.onConfirmFreight(), label: this.literals.confirm };

    this.tabFreightsColumns = [
      { property: 'code', label: this.literals.code, type: 'string' },
      { property: 'desc', label: this.literals.desc, type: 'string' }
    ];

    this.tabFreightsActions = [
      { action: this.deleteFreights.bind(this), label: this.literals.remove, icon: 'po-icon-delete' }
    ];

    this.aFreightsList = [
      { type: 1, code: 'CIF', desc: 'Cost, Insurance and Freight' },
      { type: 2, code: 'FOB', desc: 'Free on board' }
    ];

    /** Forder Finalidades */
    this.confirmFinality = { action: () => this.onConfirmFinality(), label: this.literals.confirm };

    this.tabFinalitysColumns = [
      { property: 'code', label: this.literals.code, type: 'string' },
      { property: 'desc', label: this.literals.desc, type: 'string' }
    ];

    this.tabFinalitysActions = [
      { action: this.deleteFinalitys.bind(this), label: this.literals.remove, icon: 'po-icon-delete' }
    ];

    this.aFinalitysList = [
      { type: 1, code: '001', desc: 'Industrialização' },
      { type: 2, code: '002', desc: 'Compra de Matéria Prima' },
      { type: 3, code: '003', desc: 'Exportação Indireta' }
    ];

    /** Forder Componentes */
    this.confirmComponent = { action: () => this.onConfirmComponent(), label: this.literals.confirm };

    this.tabComponentsColumns = [
      { property: 'code', label: this.literals.code, type: 'string' },
      { property: 'desc', label: this.literals.desc, type: 'string' },
      { property: 'operac', label: this.literals.operac, type: 'string' }
    ];


    this.tabComponentsActions = [
      { action: this.deleteComponents.bind(this), label: this.literals.remove, icon: 'po-icon-delete' }
    ];

    this.aComponentsList = [
      {
        code: 'Elevacao', desc: 'Elevação Frete', type: 'Elevação', operac: ''
      },
      {
        code: 'Fobbings', desc: 'Despesa Fobbings', type: 'Fobings', operac: ''
      }
    ];


    /*** Start Values */
    this.priceComponent.products = [];
    this.priceComponent.freights = [];
    this.priceComponent.components = [];
    this.priceComponent.finality = [];
    this.priceComponent.active = true;

  }

  onConfirmProduct(): boolean {
    if (this.cCodeProduct.length > 0) {

      /** verifica se já existe o produto já foi informado */
      if (this.priceComponent.products.find(x => x.code === this.cCodeProduct)) {
        this.poNotification.error('Produto já informado');
        return false;
      }

      this.priceComponent.products.push(this.aProductsList.find(x => x.code === this.cCodeProduct));
      this.cCodeProduct = '';
      this.modalProducts.close();
    }
  }

  deleteProducts(item: IPriceComponentProducts): void {
    const index = this.priceComponent.products.findIndex(x => x.code === item.code);

    if (index >= 0) {
      this.priceComponent.products.splice(index, 1);
    }
  }

  onConfirmFreight(): boolean {
    if (this.cCodeFreight.length > 0) {

      /** verifica se já existe o frete já foi informado */
      if (this.priceComponent.freights.find(x => x.code === this.cCodeFreight)) {
        this.poNotification.error('Frete já informado');
        return false;
      }

      this.priceComponent.freights.push(this.aFreightsList.find(x => x.code === this.cCodeFreight));
      this.cCodeFreight = '';
      this.modalFreights.close();
    }
  }

  deleteFreights(item: IPriceComponentFreight): void {
    const index = this.priceComponent.freights.findIndex(x => x.code === item.code);

    if (index >= 0) {
      this.priceComponent.freights.splice(index, 1);
    }
  }

  onConfirmFinality(): boolean {
    if (this.cCodeFinality.length > 0) {

      /** verifica se já existe o finalidade já foi informado */
      if (this.priceComponent.finality.find(x => x.code === this.cCodeFinality)) {
        this.poNotification.error('Finalidade já informada');
        return false;
      }

      this.priceComponent.finality.push(this.aFinalitysList.find(x => x.code === this.cCodeFinality));
      this.cCodeFinality = '';
      this.modalFinalitys.close();
    }
  }

  deleteFinalitys(item: IPriceComponentFinality): void {
    const index = this.priceComponent.finality.findIndex(x => x.code === item.code);

    if (index >= 0) {
      this.priceComponent.finality.splice(index, 1);
    }
  }

  onConfirmComponent(): boolean {
    if (this.cCodeComponent.length > 0) {

      /** verifica se já existe o finalidade já foi informado */
      if (this.priceComponent.components.find(x => x.code === this.cCodeComponent)) {
        this.poNotification.error('Componente já informado');
        return false;
      }

      const aCopyCompont = {...this.aComponentsList.find(x => x.code === this.cCodeComponent)};
      aCopyCompont.operac = this.cOperacComponent;

      this.priceComponent.components.push(aCopyCompont);
      this.cCodeComponent = '';
      this.modalComponents.close();
    }
  }

  deleteComponents(item: IPriceComponentComponent): void {
    const index = this.priceComponent.components.findIndex(x => x.code === item.code);

    if (index >= 0) {
      this.priceComponent.components.splice(index, 1);
    }
  }

  ngOnDestroy(): void { }
}
