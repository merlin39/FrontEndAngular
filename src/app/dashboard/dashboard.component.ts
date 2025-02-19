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
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
  isSmallScreen = false;
  isMenuOpen: boolean = true;
  isProfileMenuOpen: boolean = false;
  activeMenu: string | null = null;
  isLoading: boolean = true;
  lastUpdated: string = '';
  isOpened = true;
  
  adminName: string = 'Admin Name';
  count_user: number = 0;
  count_form: number = 0;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) { 
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

  reloadUI() {
    this.fetchDashboardData();
  }

  ngOnInit(): void {
    this.adminName = localStorage.getItem('admin_name') ?? 'Admin Dashboard';
    
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result: { matches: boolean }) => {
      this.isSmallScreen = result.matches;
      this.isMenuOpen = !this.isSmallScreen;
      this.cdr.detectChanges(); // บังคับให้ Angular ตรวจสอบ UI ใหม่
    });
  
    this.fetchAdminName();
    this.fetchDashboardData();
  }
  
  fetchAdminName() {
    const userId = localStorage.getItem('user_id'); // ดึง user_id จาก localStorage
    if (!userId) {
      console.warn('⚠️ ไม่มี user_id ใน localStorage');
      this.adminName = 'Admin Dashboard';
      return;
    }
  
    this.http.get<any>('http://192.168.10.53:3000/showuser').subscribe(
      (data) => {
        if (data && data.users) {
          // ค้นหาผู้ใช้ที่มี status = 2 และ user_id ตรงกับที่ล็อกอิน
          const adminUser = data.users.find((user: any) => user.status === 2 && user.user_id == userId);
          
          if (adminUser) {
            this.adminName = adminUser.f_name + ' ' + adminUser.l_name; // รวมชื่อ + นามสกุล
          } else {
            console.warn('⚠️ ไม่พบผู้ใช้ที่มีสิทธิ์แอดมิน');
            this.adminName = 'Admin Dashboard';
          }
        } else {
          console.error('❌ Error: API Response ไม่ถูกต้อง', data);
          this.adminName = 'Admin Dashboard';
        }
      },
      (error) => {
        console.error('❌ Error fetching admin name:', error);
        this.adminName = 'Admin Dashboard';
      }
    );
  }
  
  

  fetchDashboardData() {
    this.isLoading = true;

    this.http.get<any>('http://192.168.10.53:3000/count_dash')
      .subscribe(
        (data) => {
          console.log('✅ API Response:', data);

          if (data && data.summary) {
            this.count_user = data.summary.count_user ?? 0;
            this.count_form = data.summary.count_form ?? 0;
          } else {
            console.warn('⚠️ API Response is invalid or missing summary:', data);
            this.count_user = 0;
            this.count_form = 0;
          }

          this.lastUpdated = new Date().toLocaleString();
          this.isLoading = false;
        },
        (error) => {
          console.error('❌ Error fetching dashboard data:', error);
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
    this.isMenuOpen = !this.isMenuOpen;
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
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');

    Swal.fire({
      title: 'Logout',
      text: 'You have been logged out successfully.',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      window.location.href = '/login-admin';
    });
  }
}
