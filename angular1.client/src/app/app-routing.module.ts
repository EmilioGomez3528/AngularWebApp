import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { OrphanUsersComponent } from './pages/orphan-users/orphan-users.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { AddUsersComponent } from './pages/add-users/add-users.component';
import { AuthLoaderComponent } from './shared/auth-loader/auth-loader.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent },
  { path: 'orphanUsers', component: OrphanUsersComponent },
  { path: 'userDetails/:id', component: UserDetailsComponent, canActivate: [AuthGuard] },
  { path: 'addUsers/:id', component: AddUsersComponent , canActivate: [AuthGuard]},
  { path: 'authLoader', component: AuthLoaderComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
