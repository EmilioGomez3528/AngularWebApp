import { Component, input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  sidebarOpen: boolean = false;


  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
