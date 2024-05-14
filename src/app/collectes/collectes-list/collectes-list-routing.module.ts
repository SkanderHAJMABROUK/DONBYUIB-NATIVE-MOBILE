import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CollectesListPage } from './collectes-list.page';

const routes: Routes = [
  {
    path: '',
    component: CollectesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollectesListPageRoutingModule {}
