import { Component, input } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { OAuthGoogleService } from '../../services/oauth-google.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { MsalService } from '@azure/msal-angular';
import { catchError, map, switchMap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userData: any;
  editData: any;  // Variable para almacenar datos editables
  isEditMode = false; // Controla si estamos en modo de edición
  isOauthUser = 0;
  profilePic?:SafeUrl | null = null;


  constructor(private authService: AuthServiceService, private userService: UserService, private router: Router, private googleService: OAuthGoogleService, private msalService: MsalService, private http: HttpClient, private sanitizer: DomSanitizer) {
    // Obtenemos los datos del usuario al inicializar el componente
    this.userData = this.authService.getUser();
    this.editData = { ...this.userData }; // Inicializamos editData con los datos actuales del usuario

      this.getUserProfileImage();


  }

  // Habilita el modo de edición y clona los datos actuales para editarlos
  enableEditMode() {
    this.isEditMode = true;
    this.editData = { ...this.userData }; // Clonamos userData a editData para evitar cambios directos
  }

  // Guarda los cambios realizados
  onSubmit() {
    this.userData = { ...this.editData }; // Actualizamos userData con los datos editados
    this.isEditMode = false; // Salimos del modo de edición
    
    this.userService.updateProfileUser(this.userData.userId, this.editData.firstName, this.editData.lastName, this.editData.email, this.editData.username).subscribe( 
      (response) => { 
        console.log(response);
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
          },
          buttonsStyling: true
        });
        swalWithBootstrapButtons.fire({
          title: "Datos actualizados",
          text: "Datos de usuario actualizados, para ver los cambios cierra sesion!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Cerrar sesion!",
          cancelButtonText: "Mantener sesion, aplicar despues!",
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate (['/', 'login']);

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

          } else if (
            result.dismiss === Swal.DismissReason.cancel
          ) {
            // swalWithBootstrapButtons.fire({
            //   title: "Cancelado",
            //   text: "El usuario continuará sin organizacion",
            
            //   icon: "error"
            // });
          }
        });
    })   
  }

  cancelEditMode() {
    this.isEditMode = false; // Salir del modo de edición sin guardar cambios
  }


  getUserProfileImage(): void {
    const account = this.msalService.instance.getActiveAccount();
    if (!account) {
      console.error("No user is currently logged in.");
      return;
    }
  
    this.msalService.acquireTokenSilent({
      account: account,
      scopes: ['User.Read']
    }).subscribe(
      tokenResponse => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${tokenResponse.accessToken}`
        });
  
        this.http.get('https://graph.microsoft.com/v1.0/me/photo/$value', {
          headers: headers,
          responseType: 'blob'
        }).subscribe(
          (response: Blob) => {
            const objectURL = URL.createObjectURL(response);
            this.profilePic = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          },
          error => {
            console.error('Error fetching profile image:', error);
          }
        );
      },
      error => {
        console.error('Error acquiring token:', error);
      }
    );
  }
  


}
