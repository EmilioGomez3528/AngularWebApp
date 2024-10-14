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
  constructor( private userService: UserService, private route: ActivatedRoute ) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => this.userId = params['id']
    );

    this.userService.getUserRolesAndOrganizations(this.userId).subscribe( (response) => {
      this.userData = response
    },
      (error) => {
        console.log('Error');
      }
    )
  }
  
}
