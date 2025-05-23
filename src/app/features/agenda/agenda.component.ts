import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
    selector: 'app-agenda',
    standalone: true,
    imports: [CommonModule, FormsModule],
    styleUrls: ['./agenda.component.scss'],
    template: `
    <div class="agenda-container">
        <div class="agenda-card">
        <div class="logo">
            <span class="material-symbols-outlined">event_note</span>
        </div>
        <h2><span class="highlight">Cadastrar</span> Agenda</h2>
        <form (ngSubmit)="onSubmit()">
            <label>
            Título da Agenda:
            <input [(ngModel)]="title" name="title" required />
            </label>
            <label>
            Descrição:
            <textarea [(ngModel)]="description" name="description"></textarea>
            </label>
            <label>
            ID da Sessão:
            <input [(ngModel)]="sessionId" name="sessionId" type="number" required />
            </label>
            <button type="submit" class="btn-primary">Cadastrar</button>
            <button type="button" class="btn-secondary" (click)="goBack()">Voltar</button>
        </form>
        <div *ngIf="success" class="success-msg">Agenda cadastrada com sucesso!</div>
        <div *ngIf="error" class="error-msg">{{ error }}</div>
        </div>
    </div>
    `
})
export class AgendaComponent {
    title = '';
    description = '';
    sessionId: number | null = null;
    success = false;
    error = '';

    constructor(private http: HttpClient, private location: Location) {}

    onSubmit() {
        this.success = false;
        this.error = '';
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': token ? token : ''
        });

        this.http.post(
            'http://localhost:8080/api/v1/agendas',
            {
                title: this.title,
                description: this.description,
                session_id: this.sessionId
            },
            { headers }
        ).subscribe({
            next: () => {
                this.success = true;
                this.title = '';
                this.description = '';
                this.sessionId = null;
            },
            error: (err) => {
                this.error = err.error?.message || JSON.stringify(err.error) || 'Erro ao cadastrar agenda';
                
            }
            
        });
      }
        goBack(): void {
            this.location.back();
        }

startVoting(agendaId: number, durationSeconds?: number) {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': token ? token : ''
  });

  let url = `http://localhost:8080/api/v1/agendas/${agendaId}/start-voting`;
  if (durationSeconds) {
    url += `?durationSeconds=${durationSeconds}`;
  }

  this.http.post(url, {}, { headers }).subscribe({
    next: () => {
      alert('Votação iniciada com sucesso!');
    },
    error: (err) => {
      alert(err.error?.message || 'Erro ao iniciar votação');
    }
  });
}
}