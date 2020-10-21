import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PoDisclaimer } from '@po-ui/ng-components';

import { TotvsResponse } from '../interfaces/totvs-response.interface';

import { IPriceComponent } from '../model/price-component.model';

@Injectable()
export class PriceComponentService {

  // FIXME: Ajuste o módulo
  private apiUrl = 'http://localhost:8181/api/v1/';

  constructor(private http: HttpClient) { }


  query(filters: PoDisclaimer[], page = 1, pageSize = 20, expand = ''): Observable<TotvsResponse<IPriceComponent>> {

        let url: string = `${this.apiUrl}?pageSize=${pageSize}&page=${page}&expand=${expand}`;

        if (filters && filters.length > 0) {

            const urlParams = new Array<String>();

            filters.map(filter => {
                urlParams.push(`${filter.property}=${filter.value}`);
            });

            url = `${url}&${urlParams.join('&')}`;
        }

        return this.http.get<TotvsResponse<IPriceComponent>>(url);
    }

    getById(id: number , expand = ''): Observable<IPriceComponent> {
        return this.http.get<IPriceComponent>(`${this.apiUrl}/${id}?expand=${expand}`);
    }

    create(model: IPriceComponent): Observable<IPriceComponent> {
        return this.http.post<IPriceComponent>(`${this.apiUrl}`, model);
    }

    update(model: IPriceComponent): Observable<IPriceComponent> {
        return this.http.put<IPriceComponent>(`${this.apiUrl}/${model.id}`, model);
    }

    delete(id: number): Observable<Object> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

}
