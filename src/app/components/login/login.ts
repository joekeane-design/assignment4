import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}

  async onLogin(form: any) {
    if (form.valid) {
      try {
        await this.userService.login(this.email, this.password);
        this.router.navigate(['/dashboard']);
      } catch (error) {
        console.error('Login failed:', error);
        
      }
    }
  }

  
}
