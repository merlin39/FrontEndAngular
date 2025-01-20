import { Component,OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule,HttpClientModule],
  template: `
  <header class="regis-user">
    <h2 class="login-name">Create Account</h2>
  </header>
  <form class="center-form" (submit)="onSubmit($event)">
  <div class="form-group">
    <label for="name">First Name</label>
    <input id="name" type="text" [(ngModel)]="firstName" [ngModelOptions]="{standalone: true}" placeholder="First Name" required />
    <div *ngIf="firstNameError" class="error-message">{{ firstNameError }}</div>
  </div>
  <div class="form-group">
    <label for="last">Last Name</label>
    <input id="last" type="text" [(ngModel)]="lastName" [ngModelOptions]="{standalone: true}" placeholder="Last Name" required />
    <div *ngIf="lastNameError" class="error-message">{{ lastNameError }}</div>
  </div>
  <div class="form-group">
    <label for="email">Email</label>
    <input id="email" type="text" [(ngModel)]="email" [ngModelOptions]="{standalone: true}" placeholder="Enter your email" required />
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
  <button type="submit" class="btn">Sign Up</button>
</form>

`,
  styleUrls: ['register.component.css']
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  firstNameError: string | null = null;
  lastNameError: string | null = null;
  emailError: string | null = null;
  passwordError: string | null = null;
  showPassword: boolean = false;
  
  constructor(private http: HttpClient, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword; 
  }
  onSubmit(event: Event) {
    event.preventDefault();
  
    // Reset errors
    this.firstNameError = null;
    this.lastNameError = null;
    this.emailError = null;
    this.passwordError = null;
  
    // Validate fields
    if (!this.firstName.trim()) {
      this.firstNameError = 'First Name is required!';
      alert(this.firstNameError);
    }
    if (!this.lastName.trim()) {
      this.lastNameError = 'Last Name is required!';
      alert(this.lastNameError);
    }
    if (!this.email.trim()) {
      this.emailError = 'Email is required!';
      alert(this.emailError);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError = 'Invalid email format!';
      alert(this.emailError);
    }
    if (!this.password.trim()) {
      this.passwordError = 'Password is required!';
      alert(this.passwordError);
    } else if (this.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters!';
      alert(this.passwordError);
    }
  
    // If any errors exist, stop
    if (this.firstNameError || this.lastNameError || this.emailError || this.passwordError) {
      return;
    }
  
    // Create payload
    const payload = {
      f_name: this.firstName,
      l_name: this.lastName,
      email: this.email,
      password: this.password
    };
  
    // Debugging the payload (optional)
    console.log('Payload:', payload);
  
    // Send POST request to the server
    this.http.post('http://172.16.100.174:3000/register', payload).subscribe({
      next: (response) => {
        console.log('Response:', response);
        alert('Registration successful!');
        this.router.navigate(['/login']); // Navigate to the login page
      },
      error: (err) => {
        console.error('Error:', err);
        if (err.status === 400) {
          alert('Registration failed: Please check your input.');
        } else {
          alert('Registration failed: Server error. Please try again later.');
        }
      }
    });
  }
}  