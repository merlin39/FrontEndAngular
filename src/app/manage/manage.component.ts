import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-management',
  imports: [
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  isMenuOpen = false;
  isLargeScreen = window.innerWidth > 1024;
  activeMenu: string | null = null;

  displayedColumns: string[] = ['id', 'name', 'email', 'status', 'actions'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggleSidebar(): void {
    this.isMenuOpen = this.isMenuOpen;
  }

  onBackdropClick(event: Event): void {
    if (this.isMenuOpen && !this.isLargeScreen) {
      this.isMenuOpen = false;
    }
  }
// manage
  toggleSubmenu(menu: string): void {
    this.activeMenu = this.activeMenu === menu ? null : menu;
  }
// sharch
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


const ELEMENT_DATA = [
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
];
