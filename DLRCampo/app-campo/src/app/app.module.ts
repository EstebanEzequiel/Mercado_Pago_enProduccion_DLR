import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AnimalesComponent } from './home/animales/animales.component';
import { TropillasComponent } from './home/tropillas/tropillas.component';
import { CorralesComponent } from './home/corrales/corrales.component';
import { CausasDeBajaComponent } from './home/causas-de-baja/causas-de-baja.component';
import { CargasComponent } from './home/cargas/cargas.component';
import { VistasComponent } from './home/vistas/vistas.component';
import { CargaAnimalesComponent } from './home/animales/carga-animales/carga-animales.component';
import { CargaTropillaComponent } from './home/tropillas/carga-tropilla/carga-tropilla.component';
import { CargaCausasbajaComponent } from './home/causas-de-baja/carga-causasbaja/carga-causasbaja.component';
import { CargaCorralComponent } from './home/corrales/carga-corral/carga-corral.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HomeContenidoComponent } from './home-contenido/home-contenido.component';
import { VistaAnimalesComponent } from './home/animales/vista-animales/vista-animales.component';
import { VistaCorralComponent } from './home/corrales/vista-corral/vista-corral.component';
import { VistaCausasbajaComponent } from './home/causas-de-baja/vista-causasbaja/vista-causasbaja.component';
import { VistaTropillaComponent } from './home/tropillas/vista-tropilla/vista-tropilla.component';

// tuberia
import { FilterPipe } from './pipes/filter.pipe';

// estilos FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AnimalesComponent,
    TropillasComponent,
    CorralesComponent,
    CausasDeBajaComponent,
    CargasComponent,
    VistasComponent,
    CargaAnimalesComponent,
    CargaTropillaComponent,
    CargaCausasbajaComponent,
    CargaCorralComponent,
    HomeContenidoComponent,
    VistaAnimalesComponent,
    VistaCorralComponent,
    VistaCausasbajaComponent,
    VistaTropillaComponent,
    FilterPipe 
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  providers: [FormsModule, ReactiveFormsModule, {provide:LocationStrategy,useClass:HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule {}
