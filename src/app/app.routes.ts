import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageFormsComponent } from './manage-forms/manage-forms.component';
import { FormsComponent } from './forms/forms.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'manage-user', component: ManageUserComponent},
  {path: 'manage-forms', component: ManageFormsComponent},
  {path: 'forms', component: FormsComponent},
];
