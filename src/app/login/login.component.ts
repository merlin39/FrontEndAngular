import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HttpClientModule],
  template: `
<div class="Login-page">
  <!-- ฝั่งซ้าย -->
  <div class="left-section">
    <h1>Welcome to the forms!</h1>
    <img class="bralogond-" src="/assets/betime.png" alt="Brand Logo">
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
              <i [class]="showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'"></i>
            </button>
          </div>
          <div *ngIf="passwordError" class="error-message">{{ passwordError }}</div>
        </div>

        <button type="submit" class="btn">Login</button>
        <div class="text-center pt-4 text-muted">
          Don't have an account?
          <a id="Signup" routerLink="/register">Sign Up</a>
        </div>
      </form>
    </section>
  </div>
</div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  emailError: string | null = null;
  passwordError: string | null = null;
  showPassword: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    // ตรวจสอบสถานะการเข้าสู่ระบบ
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
      return;
    }
  
    this.http.post<any>(
      'http://172.16.100.187:3000/loginUSER', 
      {
        email: this.email,
        password: this.password,
      }
    ).subscribe({
      next: (response) => {
        // บันทึก token และเปลี่ยนหน้า
        alert(response.message);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login error:', err);
        alert(err.error.error || 'Login failed. Please check your credentials.');
      }
    });
  }
}
