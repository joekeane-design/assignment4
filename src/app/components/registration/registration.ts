import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/authentication-service';

@Component({
  selector: 'app-registration',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration {
  private authService = inject(AuthenticationService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  async onRegister(form: NgForm) {
    if (form.invalid) return;
    this.errorMessage = '';
    this.isLoading = true;
    try {
      await this.authService.register(this.email, this.password);
      this.router.navigate(['login']);
    } catch (error: any) {
      this.errorMessage = error.message ?? 'Registration failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
