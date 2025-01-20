import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageComponent } from './manage/manage.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageFormsComponent } from './manage-forms/manage-forms.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'manage', component: ManageComponent },
  { path: 'manage-user', component: ManageUserComponent},
  {path: 'manage-forms', component: ManageFormsComponent}

];
