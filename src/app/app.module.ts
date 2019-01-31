import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Importamos los tres nuevos modulos instalados en el proyecto
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';

import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, 
    // Hemos de añadir los módulos a la sección de imports
    BrowserAnimationsModule, 
    MatToolbarModule, 
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
