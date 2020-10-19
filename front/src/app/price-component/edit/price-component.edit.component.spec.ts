import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceComponentEditComponent } from './price-component.edit.component';

describe('PriceComponentEditComponent', () => {

    let component: PriceComponentEditComponent;
    let fixture: ComponentFixture<PriceComponentEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PriceComponentEditComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PriceComponentEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
