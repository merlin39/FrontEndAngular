import { Component, OnInit, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatBadgeModule,
    RouterModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  isMenuOpen: boolean = window.innerWidth > 768;
  isProfileMenuOpen: boolean = false;
  activeMenu: string | null = null;
  isLoading: boolean = true;
  lastUpdated: string = '';

  adminName: string = 'Admin Name';
  count_user: number = 0;
  count_form: number = 0;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/admindashboard') {
        this.reloadUI();
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMenuOpen = event.target.innerWidth > 768;
  }

  ngOnInit() {
    this.reloadUI();
  }

  reloadUI() {
    this.isLoading = true;
    setTimeout(() => {
      this.fetchDashboardData();
    }, 100);
  }

  fetchDashboardData() {
    this.http.get<any>('http://172.16.100.185:3000/count_dash')
      .subscribe(
        (data) => {
          console.log('✅ API Response:', data); // ✅ Debug API Response
  
          if (data && data.summary) {
            this.count_user = data.summary.count_user ?? 0;
            this.count_form = data.summary.count_form ?? 0;
            console.log('✅ Updated count_user:', this.count_user);
            console.log('✅ Updated count_form:', this.count_form);
          } else {
            console.warn('⚠️ API Response is invalid or missing summary:', data);
          }
  
          this.lastUpdated = new Date().toLocaleString();
          this.isLoading = false;
        },
        (error) => {
          console.error('❌ Error fetching dashboard data:', error);
          console.error('❌ Full Error:', error.error);
  
          this.isLoading = false;
          Swal.fire({
            title: 'Error!',
            text: `โหลดข้อมูลล้มเหลว: ${error.message}`,
            icon: 'error',
            confirmButtonText: 'ตกลง'
          });
        }
      );
  }
  
  
  refreshDashboard() {
    console.log('Refreshing Dashboard...');
    this.fetchDashboardData();
  }

  toggleSidebar() {
    this.sidenav.toggle();
  }

  toggleSubmenu(menu: string) {
    this.activeMenu = this.activeMenu === menu ? null : menu;
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  confirmLogout() {
    Swal.fire({
      title: 'คุณต้องการออกจากระบบหรือไม่?',
      text: 'คุณจะต้องเข้าสู่ระบบใหม่หากออกจากระบบ!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.logout();
      }
    });
  }

  logout() {
    Swal.fire({
      title: 'ออกจากระบบสำเร็จ!',
      text: 'คุณถูกออกจากระบบแล้ว',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      window.location.href = '/adminlogin';
    });
  }
}
