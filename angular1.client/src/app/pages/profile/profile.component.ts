import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userData: any;
  editData: any;  // Variable para almacenar datos editables
  isEditMode = false; // Controla si estamos en modo de edición

  constructor(private authService: AuthServiceService) {
    // Obtenemos los datos del usuario al inicializar el componente
    this.userData = this.authService.getUser();
    this.editData = { ...this.userData }; // Inicializamos editData con los datos actuales del usuario
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
    // Aquí puedes hacer una llamada al servicio para actualizar los datos en el backend si es necesario
    // this.authService.updateUser(this.userData).subscribe(...);
  }

  // Cancela el modo de edición y descarta los cambios
  cancelEditMode() {
    this.isEditMode = false; // Salimos del modo de edición sin guardar cambios
  }
}
