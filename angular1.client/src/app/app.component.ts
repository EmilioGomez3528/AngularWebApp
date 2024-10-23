import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  @ViewChild('sidenav') sidenav!: MatSidenav;

  showHeaderSidebar: boolean = false;
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Detecta cambios de ruta y oculta Header y Sidebar si es la ruta de login
    this.router.events.subscribe(() => {
      this.showHeaderSidebar = this.router.url !== '/login';
    });
    
  }

  // Método para alternar el sidebar
  toggleSidebar() {
    if (this.sidenav) {
      this.sidenav.toggle(); // Alternar el estado del sidebar
    }
  }

  title = 'angular1.client';


  
}
