import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollecteDetailsPageRoutingModule } from './collecte-details-routing.module';

import { CollecteDetailsPage } from './collecte-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CollecteDetailsPageRoutingModule
  ],
  declarations: [CollecteDetailsPage]
})
export class CollecteDetailsPageModule {}
