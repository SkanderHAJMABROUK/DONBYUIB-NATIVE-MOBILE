import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssociationsListPageRoutingModule } from './associations-list-routing.module';

import { AssociationsListPage } from './associations-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssociationsListPageRoutingModule
  ],
  declarations: [AssociationsListPage]
})
export class AssociationsListPageModule {}
