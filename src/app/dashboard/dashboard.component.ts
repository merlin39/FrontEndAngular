import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section>
      <form action="dash">
        <header class="dash-front">
          <img
            class="logo-form"
            src="assets/betime2.png"
            alt="logo"
            aria-hidden="true"
          />
          <span>Forms</span>
          <nav class="nav-menu" [class.active]="isMenuOpen">
            <ul>
              <li><a href="#">Dashboard</a></li>
              <li><a href="#">Forms</a></li>
              <li><a href="#">Reports</a></li>
              <li><a href="#">Settings</a></li>
            </ul>
          </nav>
          <button
            class="menu-toggle"
            (click)="toggleMenu()"
            [attr.aria-expanded]="isMenuOpen">
            ☰
          </button>
        </header>
        <div>
          <!-- Content Here -->
        </div>
      </form>
    </section>
  `,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isMenuOpen: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // เปิด/ปิดเมนู
  }
}
