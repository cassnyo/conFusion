import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Importamos los tres nuevos modulos instalados en el proyecto
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule, MatButton} from '@angular/material/button'
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';

import 'hammerjs';
import { MenuComponent } from './menu/menu.component';
import { DishdetailComponent } from './dishdetail/dishdetail.component';

// Servicios que queremos exponer a toda la aplicación
import { DishService } from './services/dish.service';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    DishdetailComponent
  ],
  imports: [
    BrowserModule, 
    // Hemos de añadir los módulos a la sección de imports
    BrowserAnimationsModule, 
    MatToolbarModule,
    MatListModule,  
    MatGridListModule, 
    MatCardModule, 
    MatButtonModule,
    FlexLayoutModule
  ],
  providers: [
    DishService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
