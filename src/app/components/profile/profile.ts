import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication-service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private authService = inject(AuthenticationService);
  private router = inject(Router);

  readonly currentUser = this.authService.currentUser;

  editMode = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  email = '';
  newPassword = '';
  confirmPassword = '';
  budgetGoal = 0;

  get initials(): string {
    return this.currentUser()?.email?.charAt(0).toUpperCase() ?? '?';
  }

  ngOnInit() {
    const u = this.currentUser();
    if (u) {
      this.email = u.email;
      this.budgetGoal = u.budgetGoal ?? 0;
    }
  }

  enterEditMode() {
    const u = this.currentUser();
    this.email = u?.email ?? '';
    this.budgetGoal = u?.budgetGoal ?? 0;
    this.newPassword = '';
    this.confirmPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.editMode = true;
  }

  cancelEdit() {
    this.editMode = false;
    this.errorMessage = '';
  }

  async onSave() {
    if (!this.email) {
      this.errorMessage = 'Email cannot be empty.';
      return;
    }
    if (this.newPassword && this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const updates: { email?: string; password?: string; budgetGoal?: number } = {
      email: this.email,
      budgetGoal: this.budgetGoal,
    };
    if (this.newPassword) updates.password = this.newPassword;

    this.isLoading = true;
    this.errorMessage = '';
    try {
      await this.authService.updateProfile(updates);
      this.successMessage = 'Profile updated successfully.';
      this.editMode = false;
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Failed to update profile.';
    } finally {
      this.isLoading = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
