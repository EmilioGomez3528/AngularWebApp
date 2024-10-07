import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { UserDetails } from '../../models/user-details.model';
import { RolesModalComponent } from '../../shared/roles-modal/roles-modal.component';
import { Organizations } from '../../models/organizations.model';



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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {
      /*this.userService.getDetails().subscribe(
        (data: UserDetails[]) => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (error: any) => {
          console.log("error fetching data", error);
        }
      );*/
      this.showOrganization();
  }
  // Filtro para la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.usersList.filter = filterValue.trim().toLowerCase();

    if (this.usersList.paginator) {
      this.usersList.paginator.firstPage();
    }
  }

  //Método para obtener Roles y Organizaciones de un usuario
  viewUserRoles(userId: number): void {
    
    if (!userId) {
      console.error("El userId es nulo o indefinido");
      return;
    }
    
    this.userService.getUserRolesAndOrganizations(userId).subscribe(
      (data) => {
        this.openRolesModal(data);
      },
      (error) => {
        console.error('Error al obtener roles y organizaciones', error);
      }
    );
  }

  //Método para mostrar modal de Roles y Organizaciones a las que pertenece un usuario
  openRolesModal(data: any): void {
    this.dialog.open(RolesModalComponent, {
      width: '400px',
      data: data
    });
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
    );
  }

}
