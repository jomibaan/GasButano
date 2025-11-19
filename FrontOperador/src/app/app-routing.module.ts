import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'programados',
    loadChildren: () => import('./pages/programados/programados.module').then( m => m.ProgramadosPageModule)
  },
  {
    path: 'cancelados',
    loadChildren: () => import('./pages/cancelados/cancelados.module').then( m => m.CanceladosPageModule)
  },
  {
    path: 'surtidos',
    loadChildren: () => import('./pages/surtidos/surtidos.module').then( m => m.SurtidosPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
