import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-list-wrapper">
      <div class="admin-list-container">
        <h2>Agendas</h2>
        <div *ngIf="agendas.length === 0">Nenhuma pauta encontrada.</div>
        <ul>
          <li *ngFor="let agenda of agendas">
            <div><strong>Título da Agenda:</strong> {{ agenda.title }}</div>
            <div><strong>Descrição:</strong> {{ agenda.description }}</div>
            
          </li>
        </ul>
        
      </div>
      <div class="admin-list-container">
        <h2>Seções</h2>
        <div *ngIf="sessions.length === 0">Nenhuma pauta encontrada.</div>
        <ul>
          <li *ngFor="let session of sessions">
            <div><strong>Título da Sessão:</strong> {{ session.title }}</div>
            <div><strong>Descrição:</strong> {{ session.description }}</div>
            <div><strong>Data de Início:</strong> {{ session.startAt | date:'dd/MM/yyyy HH:mm' }}</div>
            <div><strong>Data de Fim:</strong> {{ session.endAt | date:'dd/MM/yyyy HH:mm' }}</div>
            
          </li>
        </ul>
      </div>
    </div>
    <div class="pagination">
          <button (click)="prevPage()" [disabled]="page === 1">Anterior</button>
          <span>Página {{ page }}</span>
          <button (click)="nextPage()" [disabled]="!hasMore">Próxima</button>
        </div>
  `,
  styleUrls: ['./admin-list.component.scss']
})
export class AdminListComponent implements OnInit {
  sessions: any[] = [];
  agendas: any[] = [];
  page = 1;
  hasMore = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSessions();
    this.loadAgendas();
  }

  loadSessions() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token && !token.startsWith('Bearer ') ? `Bearer ${token}` : token || ''
    });
    this.http.get<any[]>('http://localhost:8080/api/v1/sessions', { headers })
      .subscribe(data => {
        this.sessions = Array.isArray(data) ? data : [];
      });
  }

  loadAgendas() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token && !token.startsWith('Bearer ') ? `Bearer ${token}` : token || ''
    });
    this.http.get<any>(`http://localhost:8080/api/v1/agendas?page=${this.page}`, { headers })
      .subscribe({
        next: data => {
          this.agendas = Array.isArray(data.results) ? data.results : [];
          this.hasMore = data.info && data.info.pages > this.page;
        },
        error: err => {
          this.agendas = [];
          console.error('Erro ao carregar agendas:', err);
        }
      });
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadAgendas();
    }
  }

  nextPage() {
    this.page++;
    this.loadAgendas();
  }
}