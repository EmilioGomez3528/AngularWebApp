import { Component, EventEmitter, Output } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  userData: any;

  constructor(private authService: AuthServiceService, private router: Router) {

    this.userData = authService.getUser();
  }

  @Output() sidebarToggled = new EventEmitter<void>();

  sidebarOpen: boolean = false;

  toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
  }

  signOut() {
    sessionStorage.removeItem('userId');

    this.router.navigate(['/login']);
  }


}
