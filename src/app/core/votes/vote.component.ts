import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="vote-container">
      <h2>Votar em uma Pauta</h2>
      <form (ngSubmit)="onSubmit()">
        <label>
          ID da Pauta (Agenda):
          <input [(ngModel)]="agendaId" name="agendaId" type="number" required />
        </label>
        <label>
          Seu voto:
          <select [(ngModel)]="voteOption" name="voteOption" required>
            <option value="" disabled selected>Selecione...</option>
            <option value="YES">Sim</option>
            <option value="NO">Não</option>
          </select>
        </label>
        <div class="form-buttons">
          <button type="submit" class="btn-primary">Votar</button>
          <button type="button" class="btn-secondary" [routerLink]="['/admin']">Voltar</button>
        </div>
      </form>
      <div *ngIf="success" class="success-msg">Voto registrado com sucesso!</div>
      <div *ngIf="error" class="error-msg">{{ error }}</div>
    </div>
  `,
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent {
  agendaId: number | null = null;
  voteOption: string = '';
  success = false;
  error = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.success = false;
    this.error = '';

    const token = localStorage.getItem('token');
    if (!token) {
      this.error = 'Usuário não autenticado!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
    });

    this.http.post(
      'http://localhost:8080/api/v1/votes',
      {
        agendaId: this.agendaId,
        voteOption: this.voteOption
      },
      { headers }
    ).subscribe({
      next: () => {
        this.success = true;
        this.agendaId = null;
        this.voteOption = '';
      },
      error: (err) => {
        this.error = err.error?.message || JSON.stringify(err.error) || 'Erro ao registrar voto';
      }
    });
  }
}