import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceComponentListComponent } from './price-component.list.component';

describe('PriceComponentListComponent', () => {

    let component: PriceComponentListComponent;
    let fixture: ComponentFixture<PriceComponentListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PriceComponentListComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PriceComponentListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
