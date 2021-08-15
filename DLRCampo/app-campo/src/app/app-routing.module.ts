import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotLoginGuard } from './ext/not-login.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AnimalesComponent } from './home/animales/animales.component';
import { TropillasComponent } from './home/tropillas/tropillas.component';
import { CorralesComponent } from './home/corrales/corrales.component';
import { CausasDeBajaComponent } from './home/causas-de-baja/causas-de-baja.component';
import { VistasComponent } from './home/vistas/vistas.component';
import { CargasComponent } from './home/cargas/cargas.component';
import { CargaAnimalesComponent } from './home/animales/carga-animales/carga-animales.component';
import { CargaTropillaComponent } from './home/tropillas/carga-tropilla/carga-tropilla.component';
import { CargaCorralComponent } from './home/corrales/carga-corral/carga-corral.component';
import { CargaCausasbajaComponent } from './home/causas-de-baja/carga-causasbaja/carga-causasbaja.component';
import { HomeContenidoComponent } from './home-contenido/home-contenido.component';
import { VistaAnimalesComponent } from './home/animales/vista-animales/vista-animales.component';
import { VistaTropillaComponent } from './home/tropillas/vista-tropilla/vista-tropilla.component';
import { VistaCorralComponent } from './home/corrales/vista-corral/vista-corral.component';
import { VistaCausasbajaComponent } from './home/causas-de-baja/vista-causasbaja/vista-causasbaja.component';

const routes : Routes =[
  {path: 'login', component: LoginComponent},
  {path:'app',children:[
    {path: 'home', component: HomeComponent,canActivate:[NotLoginGuard], children: [
      {path: 'home-contenido', component: HomeContenidoComponent},
      
      {path: 'animales', component: AnimalesComponent, children:[
        {path: 'carga-animales', component: CargaAnimalesComponent},
        {path: 'vista-animales', component: VistaAnimalesComponent}
      ]},
      {path: 'tropillas', component: TropillasComponent, children:[
        {path: 'carga-tropilla', component: CargaTropillaComponent},
        {path: 'vista-tropilla', component: VistaTropillaComponent}
      ]},
      {path: 'corrales', component: CorralesComponent, children: [
        {path: 'carga-corral', component: CargaCorralComponent},
        {path: 'vista-corral', component: VistaCorralComponent}
      ]},
      {path: 'causasdebaja', component: CausasDeBajaComponent, children: [
        {path: 'carga-causasbaja', component: CargaCausasbajaComponent},
        {path: 'vista-causasbaja', component: VistaCausasbajaComponent}
      ]},
      {path: 'vistas', component: VistasComponent},
      {path: 'cargas', component: CargasComponent},
    ]},
    {path:'',redirectTo : 'home/home-contenido',pathMatch:'full'},
  ]},
  {path:'**',redirectTo : 'app',pathMatch:'full'},

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
