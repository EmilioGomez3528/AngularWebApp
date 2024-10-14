import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { Organizations } from '../../models/organizations.model';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.css'
})
export class AddUsersComponent {

  userId!: number;
  userData: any;
  organizationList!: Organizations[];
  constructor( private userService: UserService, private route: ActivatedRoute, private authService: AuthServiceService ) { }

  ngOnInit() {


    this.showOrganization();
    this.userData = this.authService.getUser();

    this.route.params.subscribe(
      params => this.userId = params['id']
    ); 
  }

  //Metodo para cargar las organizaciones en el select
  showOrganization(): void {
    this.userService.getOrganizations().subscribe(
      (orgs: Organizations[]) => {
        this.organizationList = orgs;
      },
    );
  }

  //metodo para ageragr el usuario a una organizacion
  addUser(organizationId: number) {
  this.userService.addOrphanUserToOrg(this.userId, organizationId).subscribe ( 
  (response) => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Usuario agregado correctamente",
      showConfirmButton: false,
      timer: 1500
    });
  },
    (error) => {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "El usuario no se agregó",
        showConfirmButton: false,
        timer: 1500
      });
    }
  ) 
}
}
