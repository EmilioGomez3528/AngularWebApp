import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { UserDetails } from '../../models/user-details.model';
import { RolesModalComponent } from '../../shared/roles-modal/roles-modal.component';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ["UserId", "FirstName","LastName", "Email", "CreatedDate", "Details"]
  dataSource!: MatTableDataSource<UserDetails>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {
      this.userService.getDetails().subscribe(
        (data: UserDetails[]) => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (error: any) => {
          console.log("error fetching data", error);
        }
      );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if(this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

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

  openRolesModal(data: any): void {
    this.dialog.open(RolesModalComponent, {
      width: '400px',
      data: data
    });
  }

}
