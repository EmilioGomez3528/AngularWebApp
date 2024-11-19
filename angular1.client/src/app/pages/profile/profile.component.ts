import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { OAuthGoogleService } from '../../services/oauth-google.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userData: any;
  editData: any; // Datos para la edición del perfil
  isEditMode = false; // Controla el modo de edición
  emailTaken: boolean = false;
  usernameTaken: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private authService: AuthServiceService,
    private userService: UserService,
    private router: Router,
    private googleService: OAuthGoogleService
  ) {
    // Obtener los datos del usuario al inicializar el componente
    this.userData = this.authService.getUser();
    this.editData = { ...this.userData };
  }

  enableEditMode() {
    this.isEditMode = true;
    this.editData = { ...this.userData }; // Clonamos los datos del usuario
  }

  cancelEditMode() {
    this.isEditMode = false;
  }

  // Validar el perfil antes de guardar
  validateProfile() {
    this.isSubmitting = true;
    this.userService.validateUserProfile(this.editData.userId, this.editData.username, this.editData.email).subscribe(
      (response) => {
        this.isSubmitting = false;

        // Actualizamos los valores de validación usando las claves correctas
        this.emailTaken = response.isEmailTaken; // Cambiado a camelCase
        this.usernameTaken = response.isUserNameTaken; // Cambiado a camelCase

        if (!this.emailTaken && !this.usernameTaken) {
          this.onSubmit(); // Si no hay conflictos, enviar los datos
        }
      },
      (error) => {
        this.isSubmitting = false;
        console.error(error);
        // Manejar error si ocurre
      }
    );
  }

  // Guardar los cambios realizados
  onSubmit() {
    this.userData = { ...this.editData };
    this.isEditMode = false;

    this.userService.updateProfileUser(this.userData.userId, this.editData.firstName, this.editData.lastName, this.editData.email, this.editData.username).subscribe(
      (response) => {
        console.log(response);
        Swal.fire({
          title: 'Datos actualizados',
          text: 'Datos de usuario actualizados, para ver los cambios cierra sesión!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Cerrar sesión',
          cancelButtonText: 'Mantener sesión',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/login']);
            sessionStorage.removeItem('userId');
            this.googleService.logOutGoogle();
          }
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
