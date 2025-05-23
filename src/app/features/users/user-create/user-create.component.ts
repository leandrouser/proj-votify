import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="user-create-container">
      <h2>Cadastrar Usuário</h2>
      <form (ngSubmit)="onSubmit()">
        <label>
          Nome:
          <input [(ngModel)]="name" name="name" required />
        </label>
        <label>
          Sobrenome:
          <input [(ngModel)]="surname" name="surname" required />
        </label>
        <label>
          Email:
          <input [(ngModel)]="email" name="email" type="email" required />
        </label>
        <label>
          Senha:
          <input [(ngModel)]="password" name="password" type="password" required minlength="6" maxlength="50" />
        </label>
        <label>
          Papel:
          <select [(ngModel)]="role" name="role" required>
            <option value="" disabled selected>Selecione...</option>
            <option value="ADMIN">Administrador</option>
            <option value="ORGANIZER">Organizador</option>
            <option value="ASSOCIATE">Associado</option>
          </select>
        </label>
        <button type="submit" class="btn-primary">Cadastrar</button>
        <button type="button" class="btn-secondary" [routerLink]="['/admin']">Voltar</button>
      </form>
      <div *ngIf="success" class="success-msg">Usuário cadastrado com sucesso!</div>
      <div *ngIf="error" class="error-msg">{{ error }}</div>
    </div>
  `,
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent {
  name = '';
  surname = '';
  email = '';
  password = '';
  role = '';
  success = false;
  error = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.success = false;
    this.error = '';
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? token : ''
    });

    this.http.post(
      'http://localhost:8080/api/v1/users',
      {
        name: this.name,
        surname: this.surname,
        email: this.email,
        password: this.password,
        role: this.role
      },
      { headers }
    ).subscribe({
      next: () => {
        this.success = true;
        this.name = '';
        this.surname = '';
        this.email = '';
        this.password = '';
        this.role = '';
      },
      error: (err) => {
        this.error = err.error?.message || JSON.stringify(err.error) || 'Erro ao cadastrar usuário';
      }
    });
  }
}