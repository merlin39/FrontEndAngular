import { Routes } from '@angular/router';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageFormsComponent } from './manage-forms/manage-forms.component';
import { FormsComponent } from './forms/forms.component';
import { FormdetailComponent } from './formdetail/formdetail.component';
import { UserdetailComponent } from './userdetail/userdetail.component';




export const routes: Routes = [
  { path: '', redirectTo: 'login-admin', pathMatch: 'full' },
  {path: 'login-admin', component: LoginAdminComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'manage-user', component: ManageUserComponent},
  {path: 'manage-forms', component: ManageFormsComponent},
  {path: 'forms', component: FormsComponent},
  {path:'formdetail/:id',component:FormdetailComponent },
  {path: 'userdetail/:id',component:UserdetailComponent}
  
];
