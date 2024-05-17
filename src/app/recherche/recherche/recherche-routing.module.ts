import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecherchePage } from './recherche.page';

const routes: Routes = [
  {
    path: '',
    component: RecherchePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecherchePageRoutingModule {}
