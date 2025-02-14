import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSidenav } from '@angular/material/sidenav';
import { ChangeDetectionStrategy } from '@angular/core';
import {Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient, HttpClientModule } from '@angular/common/http'; 



@Component({
  selector: 'app-manage-forms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule
  ],
  templateUrl: './manage-forms.component.html',
  styleUrl: './manage-forms.component.css'
})
export class ManageFormsComponent implements OnInit, AfterViewInit {
  isOpened = true;
  displayedColumns: string[] = ['index', 'group_name', 'group_description', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  activeMenu: string | null = null;
  isSmallScreen = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  

  constructor(
    private breakpointObserver: BreakpointObserver,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
  }
  viewDetails(row: any): void {
    console.log('📢 คลิกที่แถว:', row);
    this.router.navigate(['/formdetail', row.group_id]); 
  }
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fetchData(); 
  }

  fetchData(): void {
    this.http.get<any>('http://172.16.100.185:3000/manage_form').subscribe(
      (response) => {
        console.log('📢 API Response:', response); 
        
        if (!response || !response.formData || response.formData.length === 0) {
          console.warn('⚠️ API Response ไม่มีข้อมูล หรืออยู่ในรูปแบบที่ผิด');
          this.dataSource.data = [];
        } else {
          console.log('✅ ข้อมูลที่ได้รับจาก API:', response.formData);
          this.dataSource.data = response.formData;
        }
  
        setTimeout(() => {
          if (this.paginator && this.sort) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
          this.cdRef.detectChanges(); 
        });
      },
      (error) => {
        console.error('❌ Error fetching data:', error);
        Swal.fire('Error', 'Failed to load data from the server', 'error');
      }
    );
  }

  toggleSidebar() {
    this.sidenav.toggle();
  }

  toggleSubmenu(menu: string): void {
    this.activeMenu = this.activeMenu === menu ? null : menu;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  edit(element: any): void {
    console.log('🔍 Editing:', element);
    this.router.navigate(['/formdetail', element.group_id]); 
  }

  delete(element: any): void {
    Swal.fire({
      title: `ยืนยันการลบข้อมูลหรือไม่?`,
      text: 'ข้อมูลนี้จะถูกลบถาวรและไม่สามารถกู้คืนได้',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบข้อมูล',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
  
        const updateUrl = `http://172.16.100.185:3000/delete_form/${element.group_id}`;
  
        console.log('กำลังเปลี่ยนสถานะ ID:', element.group_id);
        console.log('Update URL:', updateUrl);
  
        this.http.put(updateUrl, { status: 0 }).subscribe({
          next: (res) => {
          
            this.dataSource.data = this.dataSource.data.filter(
              item => item.group_id !== element.group_id
            );
  
            Swal.fire(
              'ลบสำเร็จ!',
              'ข้อมูลนี้ถูกลบไปแล้ว',
              'success'
            );
          },
          error: (error) => {
            console.error('Error changing status:', error);
            Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถลบได้', 'error');
          }
        });
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
