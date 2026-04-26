import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthenticationService } from '../../services/authentication-service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  private authService = inject(AuthenticationService);

  readonly currentUser = this.authService.currentUser;

  readonly displayName = computed(() => {
    const email = this.currentUser()?.email;
    return email ? email.split('@')[0] : '';
  });
}
