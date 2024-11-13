import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MsalService } from '@azure/msal-angular';
import { OAuthGoogleService } from '../../services/oauth-google.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @ViewChild('sidenav') sidenav!: MatSidenav;
  userData: any;

  constructor(private authService: AuthServiceService, private router: Router, private msalService: MsalService, private googleService: OAuthGoogleService, private oauthService: OAuthService) {

    this.userData = authService.getUser();
  }

  @Output() toggleSidebarEvent = new EventEmitter<void>();

  toggleSidebar() {
    this.toggleSidebarEvent.emit(); // Emitimos el evento hacia el componente padre
  }

  signOut() {
    // Remueve el userId específico si existe
    sessionStorage.removeItem('userId');
    

      this.googleService.logOutGoogle();
    // Define patrones de MSAL y otros elementos de autenticación que desees eliminar
    const patterns = ["00000000-0000-0000", "msal.", "Microsoft", "login.microsoftonline"];

    // Limpia sessionStorage basado en patrones
    patterns.forEach(pattern => {
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
          const key = sessionStorage.key(i);
          if (key && key.includes(pattern)) {
              sessionStorage.removeItem(key);
          }
      }
  });
    
        // Refresca el estado de autenticación sin redirigir
        this.router.navigate(['/login']);

    // Limpia localStorage basado en patrones
    // patterns.forEach(pattern => {
    //     for (let i = localStorage.length - 1; i >= 0; i--) {
    //         const key = localStorage.key(i);
    //         if (key && key.includes(pattern)) {
    //             localStorage.removeItem(key);
    //         }
    //     }
    // });
}


  profile(){
    this.router.navigate(['/profile']);
  }

  orphanUsers() {
    this.router.navigate(['/orphanUsers']);
  }

  users(){
    this.router.navigate(['/dashboard'])
  }


}
