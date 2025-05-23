import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AdminListComponent } from '../admin-list/admin-list.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminListComponent],
  styleUrls: ['./admin-dashboard.component.scss'],
  template: `
    <div class="admin-dashboard-container">
  <h2>Bem-vindo, {{ adminName }}</h2>
  <div class="actions">
    <button class="action-btn" (click)="navigate('user-create')">Cadastrar Usuário</button>
    <button class="action-btn" (click)="navigate('session-create')">Cadastrar Sessão</button>
    <button class="action-btn" (click)="navigate('agenda-create')">Cadastrar Agenda</button>
  </div>
  <app-admin-list></app-admin-list>
</div>
  `,
})
export class AdminDashboardComponent implements OnInit{
  adminName: string = 'Administrador';

  constructor(private auth: AuthService, private router: Router)  {}

  ngOnInit() {
    const token = this.auth.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;
        if (userId) {
          this.auth.getUserById(userId).subscribe(user => {
            this.adminName = user.name || 'Administrador';
          });
        }
      } catch {
        this.adminName = 'Administrador';
      }
    }
  }
  navigate(path: string) {
    this.router.navigate([`/admin/${path}`]);
  }
}