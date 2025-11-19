import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanceladosPage } from './cancelados.page';

const routes: Routes = [
  {
    path: '',
    component: CanceladosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CanceladosPageRoutingModule {}
