import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {

  userId: number = 0;
  userData: any;
  userInformation: any;


  constructor( private userService: UserService, private route: ActivatedRoute ) { }

  ngOnInit() {

    //Envio de parametros meidante la URL
    this.route.params.subscribe(
      params => this.userId = params['id']
    );

    //llamada al metodo oara la obtencion de roles y organizaciones del usuario
    this.userService.getUserRolesAndOrganizations(this.userId).subscribe( 
      (response) => {
      this.userData = response
    },
      (error) => {
        console.log('Error');
      }
    )
    //Llamada al metodo para obtener detalles del usuario seleccionado
    this.userService.getDetails(this.userId).subscribe ( 
      (response) => {
      this.userInformation = response
    })
  }
  
}
