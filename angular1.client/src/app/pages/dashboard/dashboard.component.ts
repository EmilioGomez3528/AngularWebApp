import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { UserDetails } from '../../models/user-details.model';
import { Organizations } from '../../models/organizations.model';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ["UserId", "FirstName","LastName", "Email", "CreatedDate", "Details"]
  dataSource!: MatTableDataSource<UserDetails>;
  organizationList!: Organizations[];
  usersList: MatTableDataSource<any> = new MatTableDataSource();
  selectedOrganization?: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private dialog: MatDialog, private route: Router) { }

  ngOnInit(): void {

      this.showOrganization();
      this.showUsersByOrganization(1);
  }

  // Filtro de registros para la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.usersList.filter = filterValue.trim().toLowerCase();

    if (this.usersList.paginator) {
      this.usersList.paginator.firstPage();
    }
  }

  //Método para obtener Roles y Organizaciones de un usuario
  viewUserRoles(userId: number): void {
    //verificacion que el userid no sea nulo o este vacio
    if (!userId) {
      console.error("El userId es nulo o indefinido");
      return;
    }
    
    this.userService.getUserRolesAndOrganizations(userId).subscribe(
      (data) => {
        //Si el valor no es nulo redirige a la vista de detalles
        this.route.navigate (['/', 'userDetails']);
      },
      (error) => {
        //Si existe un error muestra mensaje de error
            console.error('Error al obtener roles y organizaciones', error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "No existen detalles del usuario!"
            });
          }
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



  // Método para cargar los usuarios según la organización seleccionada
  showUsersByOrganization(organizationId: number): void {
    this.userService.getUsersByOrganization(organizationId).subscribe(
      (users: any[]) => {
        this.usersList = new MatTableDataSource(users);
        this.usersList.paginator = this.paginator;
        this.usersList.sort = this.sort;
      },
      (error: any) => {
        console.error("Error al obtener usuarios", error);
      }
    );

    //Asigna un valor a organizationName
    const selectedOrg = this.organizationList.find(org => org.organizationId === organizationId);
    this.selectedOrganization = selectedOrg ? selectedOrg.organizationName : 'Ninguna';
  }


}
