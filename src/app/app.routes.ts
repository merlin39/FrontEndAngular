import { Routes } from '@angular/router';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageFormsComponent } from './manage-forms/manage-forms.component';
import { FormsComponent } from './forms/forms.component';
import { FormdetailComponent } from './formdetail/formdetail.component';



export const routes: Routes = [
  { path: '', redirectTo: 'app/login-admin', pathMatch: 'full' },
  {path: 'app/login-admin', component: LoginAdminComponent},
  { path: 'app/login', component: LoginComponent },
  { path: 'app/register', component: RegisterComponent },
  { path: 'app/dashboard', component: DashboardComponent },
  { path: 'app/manage-user', component: ManageUserComponent},
  {path: 'app/manage-forms', component: ManageFormsComponent},
  {path: 'app/forms', component: FormsComponent},
 { path:'app/formdetail/:id',component:FormdetailComponent }
  
];
