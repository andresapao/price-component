import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
      path: '',
      redirectTo: '',
      pathMatch: 'full'
  },
  {
      path: 'priceComponent',
      loadChildren: () => import('./price-component/price-component.module').then(m => m.PriceComponentModule),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
