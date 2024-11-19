import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { Organizations } from '../../models/organizations.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent {

  userId!: number;
  userData: any;
  userInformation: any;
  organizationList!: Organizations[];
  selectedOrganization: Organizations | null = null;

  constructor(
    private userService: UserService, 
    private route: ActivatedRoute, 
    private authService: AuthServiceService,
    private router: Router
  ) { }

  ngOnInit() {
    this.showOrganization();
    this.userData = this.authService.getUser();

    this.route.params.subscribe(
      params => this.userId = params['id']
    );
    
    this.userService.getDetails(this.userId).subscribe((response) => {
      this.userInformation = response;
    });
  }

  // Método para cargar las organizaciones en el select
  showOrganization(): void {
    this.userService.getOrganizations().subscribe(
      (orgs: Organizations[]) => {
        this.organizationList = orgs;
      }
    );
  }

  // Método para manejar la selección de una organización
  onOrganizationSelect(org: Organizations): void {
    this.selectedOrganization = org;
  }

  // Método para confirmar la acción de agregar usuario a la organización seleccionada
  confirmAddUser(): void {
    if (this.selectedOrganization && this.userId) {
      this.userService.addOrphanUserToOrg(this.userId, this.selectedOrganization.organizationId).subscribe(
        (response) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Usuario agregado correctamente',
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'El usuario no se agregó',
            showConfirmButton: false,
            timer: 1500
          });
        }
      );
    }
  }

  // Método para cancelar la selección
  cancelSelection(): void {
    this.selectedOrganization = null;
    if (this.selectedOrganization == null) {
      this.router.navigate(['/orphanUsers']);
    }
  }
}
