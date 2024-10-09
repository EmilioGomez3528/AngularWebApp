import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @ViewChild('sidenav') sidenav!: MatSidenav;
  userData: any;

  constructor(private authService: AuthServiceService, private router: Router) {

    this.userData = authService.getUser();
  }

  @Output() toggleSidebarEvent = new EventEmitter<void>();

  toggleSidebar() {
    this.toggleSidebarEvent.emit(); // Emitimos el evento hacia el componente padre
  }

  signOut() {
    sessionStorage.removeItem('userId');

    this.router.navigate(['/login']);
  }

  profile(){
    this.router.navigate(['/profile']);
  }

  orphanUsers() {
    this.router.navigate(['/orphanUsers']);
  }

  users(){
    this.router.navigate(['/dashboard'])
  }


}
