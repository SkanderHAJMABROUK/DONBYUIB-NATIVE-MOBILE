import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollectesListPageRoutingModule } from './collectes-list-routing.module';

import { CollectesListPage } from './collectes-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CollectesListPageRoutingModule
  ],
  declarations: [CollectesListPage]
})
export class CollectesListPageModule {}
