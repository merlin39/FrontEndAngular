import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,CommonModule
  ],
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) {}

  // ฟังก์ชันสำหรับเรียก API
  onLogin() {
    this.http.get<UserResponse>('http://192.168.178.168:3000/login').subscribe({
      next: (response) => {
        if (response.success) {
          console.log('User data:', response.data);
          // คุณสามารถเก็บข้อมูลในตัวแปรเพื่อใช้งานต่อ
          const userData = response.data;
          // เพิ่มโค้ดสำหรับการจัดการ userData ได้ที่นี่
        } else {
          console.error('Error from API: Unsuccessful response');
        }
      },
      error: (error) => {
        console.error('HTTP Error:', error);
      },
    });
  }
}

// โครงสร้างข้อมูลที่ได้รับจาก API
interface UserResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    email: string;
  };
}
