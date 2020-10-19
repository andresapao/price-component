import { IPriceComponentComponent } from '../interfaces/price-component-component.interface';
import { IPriceComponentFinality } from '../interfaces/price-component-finality.interface';
import { IPriceComponentFreight } from '../interfaces/price-component-freight.interface';
import { IPriceComponentProducts } from '../interfaces/products.interface';

export interface IPriceComponent {
    id: number;
    code: string;
    desc: string;
    un: string;
    currency: string;
    extCode: string;
    type: number;
    table: string;
    application: number;
    active: boolean;
    hedge: boolean;
    products: Array<IPriceComponentProducts>;
    components: Array<IPriceComponentComponent>;
    freights: Array<IPriceComponentFreight>;
    finality: Array<IPriceComponentFinality>;
}

export class PriceComponent implements IPriceComponent {

    id: number;
    code: string;
    desc: string;
    un: string;
    currency: string;
    extCode: string;
    type: number;
    table: string;
    application: number;
    active: boolean;
    hedge: boolean;
    products: Array<IPriceComponentProducts>;
    components: Array<IPriceComponentComponent>;
    freights: Array<IPriceComponentFreight>;
    finality: Array<IPriceComponentFinality>;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    static of(json: any = {}) {
        return new PriceComponent(json);
    }

    static empty() {
        return new PriceComponent();
    }

    static fromJson(json: Array<any> = []) {

        const items: Array<IPriceComponent> = [];

        for (const values of json) {
            items.push(new PriceComponent(values));
        }

        return items;
    }

}
