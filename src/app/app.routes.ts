import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SessionCreateComponent } from './features/sessions/session-create/session-create.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { UserCreateComponent } from './features/users/user-create/user-create.component';
import { PasswordResetComponent } from './features/auth/password-reset/password-reset.component';
import { AgendaComponent } from './features/agenda/agenda.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/session-create', component: SessionCreateComponent },
  { path: 'admin/user-create', component: UserCreateComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'admin/agenda-create', component: AgendaComponent }
];