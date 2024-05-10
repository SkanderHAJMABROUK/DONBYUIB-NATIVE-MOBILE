import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssociationDetailsPage } from './association-details.page';

const routes: Routes = [
  {
    path: '',
    component: AssociationDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssociationDetailsPageRoutingModule {}
