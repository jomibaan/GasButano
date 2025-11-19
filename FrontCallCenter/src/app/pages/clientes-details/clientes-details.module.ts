import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientesDetailsPageRoutingModule } from './clientes-details-routing.module';

import { ClientesDetailsPage } from './clientes-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientesDetailsPageRoutingModule
  ],
  declarations: [ClientesDetailsPage]
})
export class ClientesDetailsPageModule {}
