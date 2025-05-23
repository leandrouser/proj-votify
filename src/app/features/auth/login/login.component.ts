import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./login.component.scss'],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-card">
        <div class="logo">
          <span class="material-symbols-outlined">how_to_vote</span>
        </div>
        <h2><span class="highlight">Votify</span> Login</h2>
        <p class="subtitle">Gerencie votações de forma segura e moderna</p>
      
        <form (ngSubmit)="onSubmit()">
          <input [(ngModel)]="email" name="email" placeholder="Email" required autocomplete="username">
          <input [(ngModel)]="password" name="password" type="password" placeholder="Senha" required autocomplete="current-password">
          <button type="submit" class="login-btn">Entrar</button>
        </form>
        <div *ngIf="error" class="error-msg">{{ error }}</
        div>
        <div class="links">
          <a href="#" (click)="onForgotPassword($event)">Esqueceu a senha?</a>
          <a href="#" (click)="onRegister($event)">Criar conta</a>
        
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.error = 'Login inválido';
      }
    });
  }
  onForgotPassword(event: Event) {
    event.preventDefault();
   this.router.navigate(['/password-reset']);
  }

  onRegister(event: Event) {
    event.preventDefault();
    this.router.navigate(['/register']);
  }
}