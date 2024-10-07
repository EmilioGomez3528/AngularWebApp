import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './shared/header/header.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './shared/footer/footer.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort'; 
import {MatCardModule} from '@angular/material/card';
import { RolesModalComponent } from './shared/roles-modal/roles-modal.component';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    DashboardComponent,
    FooterComponent,
    SidebarComponent,
    RolesModalComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule, FormsModule,
    MatTableModule, MatPaginatorModule,
    MatSortModule, MatCardModule, MatDialogContent, MatDialogActions,
    MatFormField, MatSelect, MatLabel, MatOption
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
