import { Component, OnInit,ViewChild  } from '@angular/core';
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


interface User {
  user_id: number;
  f_name: string;
  l_name: string;
  email: string;
  created_at: string;
  status: number;
}

@Component({
  selector: 'app-manage-user',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,MatButtonModule,MatIconModule,MatFormFieldModule,MatInputModule,MatTableModule,MatPaginatorModule,MatSortModule
  ],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.css'
})
export class ManageUserComponent implements OnInit {
  isOpened = true;
  displayedColumns: string[] = ['id', 'name', 'email', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  activeMenu: string | null = null;
  isSmallScreen = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private http: HttpClient, private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });

    this.loadUserData();
  }

  loadUserData(): void {
    this.http.get<{ message: string; users: User[] }>('http://172.16.100.187:3000/showuser').subscribe({
      next: (response) => {
        // แปลงข้อมูลจาก API ให้เข้ากับคอลัมน์ของตาราง
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
    console.log('Edit:', element);
  }

  delete(element: any): void {
    console.log('Delete:', element);
  }
}