import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface User {
  user_id: number;
  f_name: string;
  l_name: string;
  email: string;
  created_at: string;
  status: number;
}

interface UserTableData {
  id: number;
  name: string;
  email: string;
  status: string;
}

@Component({
  selector: 'app-manage-user',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ใช้ imports เป็น array ของ module ที่ต้องการ
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit, OnDestroy {
  isOpened = true;
  displayedColumns: string[] = ['id', 'name', 'email', 'status', 'actions'];
  dataSource = new MatTableDataSource<UserTableData>([]);
  activeMenu: string | null = null;
  isSmallScreen = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });

    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserData(): void {
    this.http.get<{ message: string; users: User[] }>('http://172.16.100.185:3000/showuser').subscribe({
      next: (response) => {
        const formattedData = response.users.map(user => ({
          id: user.user_id,
          name: `${user.f_name} ${user.l_name}`,
          email: user.email,
          status: this.getStatusText(user.status),
        }));
        this.dataSource.data = formattedData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  getStatusText(status: number): string {
    switch (status) {
      case 1:
        return 'Active';
      case 2:
        return 'Inactive';
      default:
        return 'Unknown';
    }
  }

  toggleSidebar(): void {
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
    console.log('Editing:', element);
    this.router.navigate(['/userdetail', element.id]); 
  }

  delete(element: any): void {
    Swal.fire({
      title: 'ยืนยันการลบผู้ใช้นี้หรือไม่?',
      text: 'ข้อมูลจะถูกลบถาวรและไม่สามารถกู้คืนได้',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        const updateUrl = `http://172.16.100.185:3000/delete_user/${element.id}`;
        this.http.put(updateUrl, { status: 0 }).subscribe({
          next: (res) => {
            // กรองข้อมูลใน dataSource เพื่อเอาข้อมูลที่ถูกลบออกไป
            this.dataSource.data = this.dataSource.data.filter(
              (item: any) => item.id !== element.id
            );
            Swal.fire(
              'ลบสำเร็จ!',
              'ข้อมูลผู้ใช้งานถูกลบเรียบร้อย',
              'success'
            );
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถลบข้อมูลได้', 'error');
          }
        });
      }
    });
  }
}
