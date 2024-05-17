import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualitesListPage } from './actualites-list.page';

const routes: Routes = [
  {
    path: '',
    component: ActualitesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualitesListPageRoutingModule {}
