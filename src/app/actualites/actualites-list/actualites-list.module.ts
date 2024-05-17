import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualitesListPageRoutingModule } from './actualites-list-routing.module';

import { ActualitesListPage } from './actualites-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActualitesListPageRoutingModule
  ],
  declarations: [ActualitesListPage]
})
export class ActualitesListPageModule {}
