import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, HttpClientModule],
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private http: HttpClient) {}

  onLogin() {
    this.http.get<UserResponse>('http://172.16.100.174:3000/login').subscribe({
      next: (response) => {
        if (response.success) {
          console.log('User data:', response.data);
        } else {
          console.error('Error from API');
        }
      },
      error: (error) => {
        console.error('HTTP Error:', error);
      }
    });
  }
}

interface UserResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    email: string;
  }; 
}
