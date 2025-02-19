import { Component, OnInit } from '@angular/core';
import { NgIf, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userdetail',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.css']
})
export class UserdetailComponent implements OnInit {
  userForm!: FormGroup;
  userId: string = '';
  apiUrl = 'http://192.168.10.53:3000';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      status: [1, Validators.required] // 1: Active, 0: Inactive
    });

    this.userId = this.route.snapshot.paramMap.get('id') || '';
    if (this.userId) {
      this.fetchUserDetail();
    }
  }

 goBack(): void {
  this.location.back();
}
 
fetchUserDetail(): void {
  const url = `${this.apiUrl}/showuser`;
  this.http.get<{ users: any[] }>(url).subscribe({
    next: (response) => {
      const user = response.users.find(u => u.user_id == this.userId);
      if (user) {
        this.userForm.patchValue({
          full_name: `${user.f_name} ${user.l_name}`, // รวมชื่อและนามสกุลเข้าด้วยกัน
          email: user.email,
          status: user.status
        });
      } else {
        Swal.fire('ไม่พบผู้ใช้งาน', '', 'error');
        this.router.navigate(['/manage-user']);
      }
    },
    error: (error) => {
      console.error('❌ Error fetching user detail:', error);
      Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลผู้ใช้งานได้', 'error');
    }
  });
}

submitUser(): void {
  if (this.userForm.invalid) {
    Swal.fire('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกข้อมูลให้ถูกต้อง', 'warning');
    return;
  }

  const [f_name, ...l_nameParts] = this.userForm.value.full_name.split(' ');
  const l_name = l_nameParts.join(' '); // รองรับนามสกุลที่มีหลายคำ

  const updateUrl = `${this.apiUrl}/edit_user/${this.userId}`;
  this.http.put(updateUrl, { f_name, l_name, email: this.userForm.value.email, status: this.userForm.value.status }).subscribe({
    next: () => {
      Swal.fire('สำเร็จ', 'บันทึกข้อมูลผู้ใช้งานเรียบร้อย', 'success');
      this.router.navigate(['/manage-user']);
    },
    error: (error) => {
      console.error('❌ Error updating user:', error);
      Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
    }
  });
}
}