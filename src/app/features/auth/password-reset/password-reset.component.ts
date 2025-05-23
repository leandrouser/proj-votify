import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./password-reset.component.scss'],
  template: `
    <div class="password-reset-container">
      <div class="password-reset-card">
        <div class="logo">
          <span class="material-symbols-outlined">lock_reset</span>
        </div>
        <h2><span class="highlight">Recuperar</span> Senha</h2>
        <p class="subtitle">Informe seu email para receber o código de recuperação</p>
        <form *ngIf="step === 1" (ngSubmit)="sendCode()">
          <label>
            Email:
            <input [(ngModel)]="email" name="email" type="email" required />
          </label>
          <button type="submit" class="reset-btn">Enviar código</button>
        </form>
        <form *ngIf="step === 2" (ngSubmit)="resetPassword()">
          <label>
            Email:
            <input [(ngModel)]="email" name="email" type="email" required />
          </label>
          <label>
            Código recebido:
            <input [(ngModel)]="code" name="code" maxlength="6" required />
          </label>
          <label>
            Nova senha:
            <input [(ngModel)]="password" name="password" type="password" minlength="6" required />
          </label>
          <label>
            Confirmar senha:
            <input [(ngModel)]="confirmPassword" name="confirmPassword" type="password" minlength="6" required />
          </label>
          <button type="submit" class="reset-btn">Redefinir senha</button>
        </form>
        <div *ngIf="success" class="success-msg">{{ success }}</div>
        <div *ngIf="error" class="error-msg">{{ error }}</div>
        <div *ngIf="step === 2" class="links">
          <a href="#" (click)="step=1;error='';success=''">Voltar</a>
        </div>
      </div>
    </div>
  `
})
export class PasswordResetComponent {
  step = 1;
  email = '';
  code = '';
  password = '';
  confirmPassword = '';
  success = '';
  error = '';

  constructor(private http: HttpClient) {}

  sendCode() {
    this.success = '';
    this.error = '';
    this.http.post('http://localhost:8080/api/v1/auth/forgot-password', { email: this.email })
      .subscribe({
        next: () => {
          this.success = 'Código enviado para seu email!';
          this.step = 2;
        },
        error: (err) => {
          this.error = err.error?.message || 'Erro ao enviar código.';
        }
      });
  }

  resetPassword() {
    this.success = '';
    this.error = '';
    if (this.password !== this.confirmPassword) {
      this.error = 'As senhas não coincidem.';
      return;
    }
    this.http.post('http://localhost:8080/api/v1/auth/reset-password', {
      email: this.email,
      code: this.code,
      password: this.password,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: () => {
        this.success = 'Senha redefinida com sucesso!';
        this.step = 1;
        this.code = '';
        this.password = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.error = err.error?.message || 'Erro ao redefinir senha.';
      }
    });
  }
}