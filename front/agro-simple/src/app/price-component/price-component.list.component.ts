import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import {
  PoBreadcrumb, PoDisclaimerGroup, PoDisclaimer, PoModalAction,
  PoModalComponent, PoPageAction, PoPageFilter, PoTableColumn,
  PoI18nService, PoI18nPipe, PoNotificationService
} from '@po-ui/ng-components';

import { forkJoin, Subscription } from 'rxjs';

import { TotvsResponse } from '../shared/interfaces/totvs-response.interface';

import { IPriceComponent } from '../shared/model/price-component.model';
import { PriceComponentService } from '../shared/services/price-component.service';

@Component({
  selector: 'app-price-component',
  templateUrl: './price-component.list.component.html',
  styleUrls: ['./price-component.list.component.css']
})
export class PriceComponentListComponent implements OnInit, OnDestroy {

  @ViewChild('modalDelete', { static: false }) modalDelete: PoModalComponent;

  private itemsSubscription$: Subscription;
  private disclaimers: Array<PoDisclaimer> = [];

  cancelDeleteAction: PoModalAction;
  confirmDeleteAction: PoModalAction;

  pageActions: Array<PoPageAction>;
  tableActions: Array<PoPageAction>;

  breadcrumb: PoBreadcrumb;
  disclaimerGroup: PoDisclaimerGroup;
  filterSettings: PoPageFilter;

  items: Array<IPriceComponent> = new Array<IPriceComponent>();
  columns: Array<PoTableColumn>;

  hasNext = false;
  pageSize = 20;
  currentPage = 0;
  isLoading = true;
  quickSearchValue = '';
  moreSelected = false;
  selectedLength = 0;

  literals: any = {};

  constructor(
    private service: PriceComponentService,
    private poI18nPipe: PoI18nPipe,
    private poI18nService: PoI18nService,
    private poNotification: PoNotificationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const requests = [
      this.poI18nService.getLiterals(),
      this.poI18nService.getLiterals({ context: 'priceComponent' })
    ];

    forkJoin(requests).subscribe(literals => {
      literals.map(item => Object.assign(this.literals, item));
      this.setupComponents();
      this.search();
    });
  }

  searchByName(filter: any): void {
    console.log(filter);
    this.disclaimers = [{ property: 'desc', value: filter}];
    this.disclaimerGroup.disclaimers = [...this.disclaimers];
  }

  search(loadMore = false): void {

    const disclaimer = this.disclaimers || [];

    if (loadMore === true) {
      this.currentPage = this.currentPage + 1;
    } else {
      this.items = [];
      this.currentPage = 1;
    }

    this.isLoading = true;
    this.itemsSubscription$ = this.service
      .query(disclaimer, this.currentPage, this.pageSize, 'products,components,finality,freights')
      .subscribe((response: TotvsResponse<IPriceComponent>) => {
        this.items = [...this.items, ...response.items];
        this.hasNext = response.hasNext;
        this.isLoading = false;
      });
  }

  private delete(): void {

    let count = 0;
    const selected = this.items.filter((item: any) => item.$selected);

    if (selected.length > 0) {
      selected.map((item: IPriceComponent) => {
        this.service.delete(item.id).subscribe(response => {
          this.poNotification.success(
            this.poI18nPipe.transform(
              this.literals['excludedMessage'], [item.desc]
            )
          );
          if (++count === selected.length) {
            this.search();
          }
        }, (err: any) => {
          if (++count === selected.length) {
            this.search();
          }
        });
      });
    }
  }

  private edit(item: IPriceComponent): void {
    this.router.navigate(['/priceComponent/edit', item.id]);
  }

  private resetFilters(): void {
    this.quickSearchValue = '';
  }

  private onChangeDisclaimer(disclaimers): void {
    this.disclaimers = disclaimers;
    if (this.disclaimers.length === 0) {
      this.resetFilters();
    }
    this.search();
  }

  private onConfirmDelete(): void {
    this.modalDelete.close();
    this.delete();
    this.selectedLength = 0;
    this.moreSelected = false;
  }

  private cancelDelete() {
    this.modalDelete.close();
    this.selectedLength = 0;
    this.moreSelected = false;
  }

  private selected() {
    return !this.items.find(item => item['$selected']);
  }

  private deleteModalValidate() {
    const selected = this.items.filter((item: any) => item.$selected);
    if (selected.length > 1) {
      this.moreSelected = true;
      this.selectedLength = selected.length;
    }
    this.modalDelete.open();
  }

  private setupComponents(): void {

    this.confirmDeleteAction = { action: () => this.onConfirmDelete(), label: this.literals['yes'] };

    this.cancelDeleteAction = { action: () => this.cancelDelete(), label: this.literals['no'] };

    this.pageActions = [
      {
        label: this.literals['addNewPriceComponent'],
        action: () => this.router.navigate(['priceComponent/new']), icon: 'po-icon-plus'
      },
      { label: this.literals['remove'], action: () => this.deleteModalValidate(), disabled: () => this.selected() }
    ];

    this.columns = [
      { property: 'code', label: this.literals['code'], type: 'link', action: (value, row) => this.edit(row) },
      { property: 'desc', label: this.literals['desc'], type: 'string' },
      {
        property: 'type', label: this.literals['type'], type: 'label', labels: [
          { value: 1, color: 'color-08', label: 'Custo' },
          { value: 2, color: 'color-07', label: 'Preço' },
          { value: 3, color: 'color-05', label: 'Informativo' },
          { value: 4, color: 'color-02', label: 'Margem' },
          { value: 5, color: 'color-11', label: 'Preço Produto' }
        ]
      },
      {
        property: 'application', label: this.literals['application'], type: 'label', labels: [
          { value: 1, color: 'color-02', label: 'Compras' },
          { value: 2, color: 'color-11', label: 'Vendas' }
        ]
      },
      { property: 'active', label: this.literals['active'], type: 'boolean' }
    ];

    this.breadcrumb = {
      items: [
        { label: this.literals['priceComponent'], link: '/priceComponent' }
      ]
    };

    this.disclaimerGroup = {
      title: this.literals['filters'],
      disclaimers: [],
      change: this.onChangeDisclaimer.bind(this)
    };

    this.filterSettings = {
      action: this.searchByName.bind(this),
      placeholder: this.literals['search']
    };
  }

  ngOnDestroy(): void {
    this.itemsSubscription$.unsubscribe();
  }
}
