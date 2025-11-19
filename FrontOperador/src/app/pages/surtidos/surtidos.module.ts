import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SurtidosPageRoutingModule } from './surtidos-routing.module';

import { SurtidosPage } from './surtidos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SurtidosPageRoutingModule
  ],
  declarations: [SurtidosPage]
})
export class SurtidosPageModule {}
