import { Component,OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule], 
  template: `
    <header class="login-user">
      <h2 class="login-name">Login</h2>
      <img class="brand-logo" src="/assets/wel.png" alt="logo" aria-hidden="true">
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
        type="button" (click)="togglePasswordVisibility()" class="toggle-password" aria-label="Toggle password visibility" >
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
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  emailError: string | null = null;
  passwordError: string | null = null;
  showPassword: boolean = false;
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    // รีเซ็ตหน้าทุกครั้ง
    this.email = '';
    this.password = '';
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
    }
    if (!this.password) {
      this.passwordError = 'Please enter your password!';
    }
  
    if (this.emailError || this.passwordError) {
      return;
    }
  
    if (this.email === 'test@gmail.com' && this.password === 'pass1111') {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Invalid email or password!');
  
      this.email = '';
      this.password = '';
    }
  }
}  