import { Component } from '@angular/core';
import { OAuthGoogleService } from '../../services/oauth-google.service';
import { UserService } from '../../services/user.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-auth-loader',
  templateUrl: './auth-loader.component.html',
  styleUrl: './auth-loader.component.css'
})
export class AuthLoaderComponent {
constructor(private googleService: OAuthGoogleService, private userService: UserService, private authService: AuthServiceService, private router: Router) {}

name?: string;
email?: string;
sub?: string;
errorMessage: string | null = null;


getGoogleData() {
  const data = this.googleService.getData();

  // Verifica si `data` es null o undefined antes de intentar acceder a sus propiedades
  if (data) {
    this.name = data['name'];
    this.email = data['email'];
    this.sub = data['sub'];

    const [firstName = '', lastName = ''] = this.name?.split(' ') || [];

    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Correo:", this.email);
    console.log("Sub:", this.sub);

    if (this.email && this.sub) {
      this.userService.OAuth(firstName, lastName, this.email, this.sub).subscribe(
        (authResponse) => {
          this.authService.setLoginStatus(authResponse);
          this.router.navigate(['/', 'dashboard']);
        },
        (authError) => {
          console.error("Error en la autenticación", authError);
          this.errorMessage = 'Autenticación fallida. Por favor, intente de nuevo.';
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Autenticación fallida. Por favor, intente de nuevo.",
          });
        }
      );
    } else {
      console.error("providerUserId o email están indefinidos");
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Autenticación fallida. Por favor, intente de nuevo.",
    });
    this.router.navigate(['/', 'login']);
  }
}

}
