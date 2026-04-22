import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-registration',
  imports: [FormsModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration {
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}

  async onRegister(form: any) {
    if (form.valid) {
      try {
        await this.userService.addUser(this.email, this.password);
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Registration failed:', error);
        // Handle error, e.g., show message
      }
    }
  }
}
