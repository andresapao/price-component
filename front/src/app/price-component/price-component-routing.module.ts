import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PriceComponentEditComponent } from './edit/price-component.edit.component';
import { PriceComponentListComponent } from './price-component.list.component';

const routes: Routes = [
    {
        path: '',
        component: PriceComponentListComponent,
    },
    {
        path: 'new',
        component: PriceComponentEditComponent
    },
    {
        path: 'edit/:id',
        component: PriceComponentEditComponent
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PriceComponentRoutingModule { }
