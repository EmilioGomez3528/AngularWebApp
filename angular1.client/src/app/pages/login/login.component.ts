import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';


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

  constructor (private userService: UserService, private authService: AuthServiceService , private router: Router) {}


  //metodo que se llama al presionar el boton
  onSubmit() {
    this.userService.login(this.username, this.password).subscribe(
      (response) => {
        // const userID = response.userId; //Obtiene el valor de ID del objeto
        this.authService.setLoginStatus(response); 
        this.router.navigate (['/', 'dashboard']);//Redirige a dashboard si los datos son correctos
      },
      (error) => {
        console.error('Error en el login', error);
        this.errorMessage = 'Login failed. Please try again.';
      }
    );
  }
}
