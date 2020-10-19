import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PoMenuItem, PoToolbarProfile } from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  profileToolbar: PoToolbarProfile = {
    subtitle: 'teste@totvs.com.br',
    title: 'Comercial'
  };

  constructor(
    private router: Router
  ) { }

  readonly menus: Array<PoMenuItem> = [
    { label: 'Página Inicial', action: this.onClick.bind(this) },
    { label: 'Componentes de Preço', action: this.router.navigate(['/priceComponent/']) }
  ];

  private onClick(): void {
    alert('Página Principal em construção');
  }

}
