import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-session-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  template: `
    <div class="session-create-container">
      <h2>Cadastrar Nova Sessão</h2>
      <form (ngSubmit)="onSubmit()">
        <label>
          Título da Sessão:
          <input [(ngModel)]="title" name="title" required />
        </label>
        <label>
          Descrição:
          <textarea [(ngModel)]="description" name="description" required></textarea>
        </label>
        <label>
          Data/Hora de Início:
          <input [(ngModel)]="startDate" name="startDate" type="datetime-local" required />
        </label>
        <label>
          Data/Hora de Fim:
          <input [(ngModel)]="endDate" name="endDate" type="datetime-local" />
        </label>
        <label>
          ID do Organizador:
          <input [(ngModel)]="organizerId" name="organizerId" type="number" required />
        </label>
        <div class="form-buttons">
          <button type="submit" class="btn-primary">Cadastrar</button>
          <button type="button" class="btn-secondary" [routerLink]="['/admin']">Voltar</button>
        </div>
      </form>
      <div *ngIf="success" class="success-msg">Sessão cadastrada com sucesso!</div>
      <div *ngIf="error" class="error-msg">{{ error }}</div>
    </div>
  `,
  styleUrls: ['./session-create.component.scss']
})
export class SessionCreateComponent {
  title = '';
  description = '';
  startDate = '';
  endDate = '';
  organizerId: number | null = null;
  success = false;
  error = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.success = false;
    this.error = '';

    // Validação básica
    if (!this.title || !this.description || !this.startDate || !this.organizerId) {
      this.error = 'Preencha todos os campos obrigatórios!';
      return;
    }

    const formatDate = (dateStr: string) => {
      if (!dateStr) return null;
      // datetime-local retorna "YYYY-MM-DDTHH:mm"
      // Backend espera "YYYY-MM-DDTHH:mm:ss"
      const [date, time] = dateStr.split('T');
      return `${date}T${time.length === 5 ? time + ':00' : time}`;
    };

    const startDateISO = formatDate(this.startDate);
    const endDateISO = this.endDate ? formatDate(this.endDate) : null;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token.replace('Bearer ', '')}` : ''
    });

    this.http.post(
  'http://localhost:8080/api/v1/sessions',
  {
    title: this.title,
    description: this.description,
    start_date: startDateISO,
    end_date: endDateISO,
    organizer_id: this.organizerId
  },
  { headers }
    ).subscribe({
      next: () => {
        this.success = true;
        this.title = '';
        this.description = '';
        this.startDate = '';
        this.endDate = '';
        this.organizerId = null;
      },
      error: (err) => {
        this.error = err.error?.message || JSON.stringify(err.error) || 'Erro ao cadastrar sessão';
      }
    });
  }
}