import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserDetails } from '../../models/user-details.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { RolesModalComponent } from '../../shared/roles-modal/roles-modal.component';

@Component({
  selector: 'app-orphan-users',
  templateUrl: './orphan-users.component.html',
  styleUrl: './orphan-users.component.css'
})
export class OrphanUsersComponent implements OnInit{

  displayedColumns: string[] = ["UserId","FirstName","LastName","Email", "CreatedDate","Details"]
  dataSource!: MatTableDataSource<UserDetails>;
  usersList: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
      this.showOrphanUsers();
  }

  //Filtro de la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.usersList.filter = filterValue.trim().toLowerCase();

    if (this.usersList.paginator) {
      this.usersList.paginator.firstPage();
    }
  }

  viewUserRoles(userId: number): void {

    if (!userId){
      console.error("El id del usuario es nulo o indefinido");
      return;
    }

    this.userService.getUserRolesAndOrganizations(userId).subscribe(
      (data) => {
        this.openRolesModal(data);
      },
      (error) => {
        console.error('Error al obtener roles y organizaciones', error);
        this.router.navigate (['/', 'addUsers', userId]);
        //ALERTA 
        // const swalWithBootstrapButtons = Swal.mixin({
        //   customClass: {
        //     confirmButton: "btn btn-success",
        //     cancelButton: "btn btn-danger"
        //   },
        //   buttonsStyling: true
        // });
        // swalWithBootstrapButtons.fire({
        //   title: "¿Deseas agregar a una organizacion?",
        //   text: "Este usuario no posee una organizacion!",
        //   icon: "warning",
        //   showCancelButton: true,
        //   confirmButtonText: "Si, editar!",
        //   cancelButtonText: "No, cancelar!",
        //   reverseButtons: true
        // }).then((result) => {
        //   if (result.isConfirmed) {
            
        //   } else if (
        //     result.dismiss === Swal.DismissReason.cancel
        //   ) {
        //     swalWithBootstrapButtons.fire({
        //       title: "Cancelado",
        //       text: "El usuario continuará sin organizacion",
        //       icon: "error"
        //     });
        //   }
        // });
      }
    )
  }

  //Método para mostrar modal de Roles y Organizaciones a las que pertenece un usuario
  openRolesModal(data: any): void {
    this.dialog.open(RolesModalComponent, {
      width: '400px',
      data: data
    });
  }

  //Metodo para cargar los usuarios huerfanos
  showOrphanUsers(){
    this.userService.getWithoutOrganization().subscribe(
      (users: any[]) => {
        this.usersList = new MatTableDataSource(users);
        this.usersList.paginator = this.paginator;
        this.usersList.sort = this.sort;
      },
      (error: any) => {
        console.error("Error al obtener usuarios", error);
      }
    )
  }
}
