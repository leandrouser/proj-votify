import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['../admin/admin-dashboard/admin-dashboard.component.scss'],
  template: `
    <div class="admin-dashboard-container">
      <h2>Bem-vindo, Administrador!</h2>
      <div class="actions">
        <button class="action-btn" (click)="navigate('user-create')">Cadastrar Usuário</button>
        <button class="action-btn" (click)="navigate('session-create')">Cadastrar Sessão</button>
        <button class="action-btn" (click)="navigate('agenda-create')">Cadastrar Agenda</button>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([`/admin/${path}`]);
  }
}