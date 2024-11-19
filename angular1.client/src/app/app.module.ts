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
import { ProfileComponent } from './pages/profile/profile.component';
import { OrphanUsersComponent } from './pages/orphan-users/orphan-users.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule, MatIconAnchor, MatIconButton } from '@angular/material/button';
import { MatListItemIcon, MatListModule } from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { AddUsersComponent } from './pages/add-users/add-users.component';
import { MSAL_INSTANCE, MsalModule, MsalService } from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AuthLoaderComponent } from './shared/auth-loader/auth-loader.component';
import { NullPlaceholderPipe } from './pipes/null-placeholder.pipe';


export function MSALInstanceFactory(): IPublicClientApplication{
  return new PublicClientApplication({
    auth: {
      clientId: '17fa375e-fb92-4056-b5d1-2248e7353814',
      redirectUri: 'https://localhost:4200'
    }
  })
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    DashboardComponent,
    FooterComponent,
    SidebarComponent,
    RolesModalComponent,
    ProfileComponent,
    OrphanUsersComponent,
    UserDetailsComponent,
    AddUsersComponent,
    AuthLoaderComponent,
    NullPlaceholderPipe
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule, FormsModule,
    MatTableModule, MatPaginatorModule,
    MatSortModule, MatCardModule,
    MatDialogContent, MatDialogActions,
    MatFormField, MatSelect, MatLabel, MatOption,
    MatSidenavModule,MatToolbarModule,MatButtonModule,
    MatListModule, MatListItemIcon, MatIconAnchor, MatIconButton, MatIconModule,
    MsalModule, OAuthModule.forRoot()
  ],
  providers: [
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    MsalService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
