import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { OAuthGoogleService } from '../../services/oauth-google.service';
import Swal from 'sweetalert2'


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
  provider?: string;
  initials?: string;
  IsLocal: Boolean = false;

  constructor (
    private userService: UserService, 
    private authService: AuthServiceService , 
    private router: Router, 
    private msalService: MsalService, 
    private googleService: OAuthGoogleService) { 
    msalService.initialize().subscribe(result => { console.log(result)  })
  }


  //metodo que se llama al presionar el boton
  onSubmit() {
    this.userService.login(this.username, this.password, true).subscribe(
      (response) => {
        //Llamada al metodo de inicio de sesion
        this.authService.setLoginStatus(response); 
        this.router.navigate (['/', 'dashboard']);//Redirige a dashboard si los datos son correctos

        // alerta de inicio de sesion correcto
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
        // alerta de inicio de sesion incorrecto
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error de inicio de sesion, intente de nuevo por favor.",
        });
      }
    );
  }


  loginWithMicrosoft() {
    sessionStorage.removeItem('msal.interaction.status'); //Quita valor de interaccion de la consola
    this.msalService.loginPopup({
      prompt: "login",
      scopes: ['user.read']
    }).subscribe(
      (response: AuthenticationResult) => {
        this.msalService.instance.setActiveAccount(response.account);
        
        // Obtencion de elementos del usuario
        const claims = response.idTokenClaims as {
          name?: string;
          preferred_username?: string;
          sub?: string;
        };

        if (claims) {
          this.name = claims.name;
          this.preferredUsername = claims.preferred_username;
          this.providerId = claims.sub;
          this.provider = 'Microsoft'
          

          const [firstName = '', lastName = ''] = this.name?.split(' ') || [];
          if (this.preferredUsername && this.providerId) {
            this.userService.OAuth(firstName, lastName, this.preferredUsername, this.providerId, this.provider).subscribe(
              //RESPUESTA DEL METODO OAuth
              (authResponse) => {
                var username = this.preferredUsername || "";
                this.userService.login(username, "" , false).subscribe ( 
                  (loginResponse) => {
                  //Lllamada al metodo de inicio de sesion
                  this.authService.setLoginStatus(loginResponse);
                  this.router.navigate(['/', 'dashboard']);

                  // alerta de inicio de sesion correcto
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

                })
              },
              //Error en el metodo OAuth
              (authError) => {
                console.error("Error en la autenticación", authError);
                this.errorMessage = 'Autenticación fallida. Por favor, intente de nuevo.';
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Error de autenticación, intente de nuevo por favor.",
                });
              }
            );
          } 
          else {
            console.error("preferredUsername o providerId están indefinidos");
          }
        }
      },
      (error) => {
        console.error('Error en el login', error);
        this.errorMessage = 'Autenticación fallida. Por favor, intente de nuevo.';
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error de inicio de sesión, intente de nuevo por favor.",
        });
      }
    );
  }

  loginWithGoogle() {
    this.googleService.loginGoogle();
  }

}
