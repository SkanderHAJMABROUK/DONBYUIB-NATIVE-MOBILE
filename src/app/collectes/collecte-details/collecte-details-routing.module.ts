import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CollecteDetailsPage } from './collecte-details.page';

const routes: Routes = [
  {
    path: '',
    component: CollecteDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollecteDetailsPageRoutingModule {}
