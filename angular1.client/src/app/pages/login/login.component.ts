import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import Swal from 'sweetalert2'
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  //Propiedades que almacenan los datos del formulario
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;
  name?: string;
  preferredUsername?: string;
  providerId?: string;

  constructor (private userService: UserService, private authService: AuthServiceService , private router: Router, private msalService: MsalService) { 
    msalService.initialize().subscribe(result => { console.log(result)  })
    
  }


  //metodo que se llama al presionar el boton
  onSubmit() {
    this.userService.login(this.username, this.password).subscribe(
      (response) => {
        // const userID = response.userId; //Obtiene el valor de ID del objeto
        this.authService.setLoginStatus(response); 
        this.router.navigate (['/', 'dashboard']);//Redirige a dashboard si los datos son correctos

        const Toast = Swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Inicio de sesion correcto"
        });

      },
      (error) => {
        console.error('Error en el login', error);
        this.errorMessage = 'Login failed. Please try again.';
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error de inicio de sesion, intente de nuevo por favor.",
        });
      }
    );
  }


  loginWithMicrosoft() {
    sessionStorage.removeItem('msal.interaction.status');
    this.msalService.loginPopup().subscribe( (response: AuthenticationResult) => {
      this.msalService.instance.setActiveAccount(response.account)
    });
  }

  
  isLoggedIn() : boolean {
    return this.msalService.instance.getActiveAccount() != null
    
  }

  logoutWithMicrosoft() {
    this.msalService.logout();
    
  }


  getUserInfo() {
    this.msalService.loginPopup({
      scopes: ['user.read'] 
    }).subscribe({
      next: (response: any) => {
        const claims = response.idTokenClaims;
  
        if (claims) {
          this.name = claims.name;
          this.preferredUsername = claims.preferred_username;
          this.providerId = claims.sub;
  
          console.log("Nombre:", this.name);
          console.log("Correo:", this.preferredUsername);
          console.log("Sub:", this.providerId);
        }
  
        if (response && response.account) {
          this.username = response.account.username;
          console.log("Nombre de usuario:", this.username);
        }
      },
      error: (err) => {
        console.error('Error al iniciar sesión', err);
      }
    });
  }
  


}
