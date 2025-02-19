import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';  

@Component({
  selector: 'app-login-admin',
  imports: [CommonModule, FormsModule, HttpClientModule,RouterModule],

  template: `
  <div class="Login-page">
    <!-- ฝั่งซ้าย -->
    <div class="left-section">
      <h1>Welcome to the forms!</h1>
      <img [src]="'/assets/betime.png'" alt="Brand Logo">
      </div>

    <!-- ฝั่งขวา -->
    <div class="right-section">
      <header class="login-user">
        <h2 class="login-name">Login</h2>
      </header>
      <section class="Login">
        <form class="center-form" (submit)="onLogin($event)">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email" 
              type="text" 
              [(ngModel)]="email" 
              name="email" 
              placeholder="Enter your email" 
              required 
            />
            <div *ngIf="emailError" class="error-message">{{ emailError }}</div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-container">
              <input
                id="password"
                [type]="showPassword ? 'text' : 'password'"
                [(ngModel)]="password"
                name="password"
                placeholder="Enter your password"
                required
              />
              <button
                type="button" 
                (click)="togglePasswordVisibility()" 
                class="toggle-password" 
                aria-label="Toggle password visibility">
                <i [ngClass]="showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'"></i>
              </button>
            </div>
            <div *ngIf="passwordError" class="error-message">{{ passwordError }}</div>
          </div>

          <button type="submit" class="btn">Login</button>
        </form>
      </section>
    </div>
  </div>
`,
  styleUrl: './login-admin.component.css'
})
export class LoginAdminComponent {
  email: string = '';
  password: string = '';
  emailError: string | null = null;
  passwordError: string | null = null;
  showPassword: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(event: Event) {
    event.preventDefault();
  
    this.emailError = null;
    this.passwordError = null;
  
    if (!this.email) {
      this.emailError = 'Please enter your email!';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError = 'Invalid email format!';
    }
  
    if (!this.password) {
      this.passwordError = 'Please enter your password!';
    }
  
    if (this.emailError || this.passwordError) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please make sure all fields are filled out correctly!',
      });
      return;
    }
  
    this.http.post<any>(
      'http://192.168.10.53:3000/login', 
      {
        email: this.email,
        password: this.password,
      }
    ).subscribe({
      next: (response) => {
        console.log('API response:', response);
    
        // ดึง user_id จาก response.user
        const userId = response.user?.user_id;
        
        if (userId) {
          localStorage.setItem('user_id', userId.toString());
          console.log('User_ID :', localStorage.getItem('user_id'));
    
          this.router.navigate(['/dashboard'], { queryParams: { user_id: userId } }).then(() => {
            console.log('Navigation to dashboard successful!');
          });
    
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: `Welcome, ${response.user.f_name} ${response.user.l_name}!`,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'User ID not found in response.',
          });
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: err.error?.error || 'Invalid credentials. Please try again.',
        });
      }
    });    
    
  }
}

