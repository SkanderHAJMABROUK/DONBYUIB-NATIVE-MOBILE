import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssociationDetailsPageRoutingModule } from './association-details-routing.module';

import { AssociationDetailsPage } from './association-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssociationDetailsPageRoutingModule
  ],
  declarations: [AssociationDetailsPage]
})
export class AssociationDetailsPageModule {}
