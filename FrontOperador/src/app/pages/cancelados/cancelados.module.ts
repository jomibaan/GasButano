import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CanceladosPageRoutingModule } from './cancelados-routing.module';

import { CanceladosPage } from './cancelados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CanceladosPageRoutingModule
  ],
  declarations: [CanceladosPage]
})
export class CanceladosPageModule {}
