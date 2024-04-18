import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssociationsListPage } from './associations-list.page';

const routes: Routes = [
  {
    path: '',
    component: AssociationsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssociationsListPageRoutingModule {}
