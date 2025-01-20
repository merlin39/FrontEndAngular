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


@Component({
  selector: 'app-manage-forms',
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,MatButtonModule,MatIconModule,MatFormFieldModule,MatInputModule,MatTableModule,MatPaginatorModule,MatSortModule
  ],
  templateUrl: './manage-forms.component.html',
  styleUrl: './manage-forms.component.css'
})
export class ManageFormsComponent {
  isOpened = true; // สถานะของ Sidebar
  displayedColumns: string[] = ['id', 'name', 'email', 'status', 'actions'];
  dataSource = new MatTableDataSource([
    { id: 1, name: 'John Doe', age: 30, status: 'Active' },
  { id: 2, name: 'Jane Smith', age: 25, status: 'Inactive' },
  { id: 3, name: 'Emily Davis', age: 35, status: 'Pending' },
  { id: 4, name: 'Michael Johnson', age: 40, status: 'Active' },
  { id: 5, name: 'Sarah Wilson', age: 45, status: 'Inactive' },
  { id: 6, name: 'Chris Brown', age: 28, status: 'Active' },
  { id: 7, name: 'Anna Taylor', age: 32, status: 'Pending' },
  { id: 8, name: 'James Williams', age: 39, status: 'Inactive' },
  { id: 9, name: 'Robert Miller', age: 50, status: 'Active' },
  { id: 10, name: 'Laura Wilson', age: 27, status: 'Pending' },
    // เพิ่มข้อมูลเพิ่มเติมตามต้องการ
  ]); 
  activeMenu: string | null = null;
  isSmallScreen = false; 

  constructor(private breakpointObserver: BreakpointObserver) {}


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isSmallScreen = result.matches;
      
    });
  }

  toggleSidebar() {
    this.sidenav.toggle();
  }
  // manage
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
