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
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { Router } from '@angular/router';


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
    this.fetchData(); // โหลดข้อมูลจาก API
  }

  fetchData(): void {
    this.http.get<any>('http://192.168.178.168:3000/manage_form').subscribe(
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
          this.cdRef.detectChanges(); // อัปเดต UI
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
    this.router.navigate(['/formdetail', element.group_id]); // ✅ นำทางไปยัง formdetail/:id
  }
  
  delete(element: any): void {
    console.log('Delete:', element);
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
