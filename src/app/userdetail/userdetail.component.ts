import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userdetail',
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatSelectModule,MatProgressSpinnerModule
  ],
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.css']
})
export class UserdetailComponent implements OnInit {
  userForm!: FormGroup;
  userId: string = '';
  apiUrl = 'http://192.168.10.53:3000';
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private location: Location
  ) {}
  formTitle = 'แก้ไขข้อมูลผู้ใช้';
  
  ngOnInit(): void {
    this.userForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      status: [1, Validators.required]
    });

    this.userId = this.route.snapshot.paramMap.get('id') || '';
    if (this.userId) {
      this.fetchUserDetail();
    } else {
      Swal.fire('ไม่พบข้อมูลผู้ใช้', 'กรุณาเลือกผู้ใช้ใหม่', 'error');
      this.router.navigate(['/manage-user']);
    }
  }

  goBack(): void {
    this.location.back();
  }

  fetchUserDetail(): void {
    const url = `${this.apiUrl}/showuser`;

    this.http.get<{ users: any[] }>(url).subscribe({
      next: (response) => {
        this.isLoading = false;
        const user = response.users.find(u => u.user_id == this.userId);

        if (user) {
          this.userForm.patchValue({
            full_name: `${user.f_name} ${user.l_name}`.trim(),
            email: user.email,
            status: user.status
          });
        } else {
          Swal.fire('ไม่พบข้อมูลผู้ใช้', 'กรุณาเลือกผู้ใช้ใหม่', 'error');
          this.router.navigate(['/manage-user']);
        }
      },
      error: (error) => {
        this.isLoading = false;
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

    const nameParts = this.userForm.value.full_name.trim().split(' ');
    const f_name = nameParts[0]; 
    const l_name = nameParts.slice(1).join(' ') || '-';

    const updateUrl = `${this.apiUrl}/edit_user/${this.userId}`;
    this.http.put(updateUrl, { 
      f_name, 
      l_name, 
      email: this.userForm.value.email, 
      status: this.userForm.value.status 
    }).subscribe({
      next: () => {
        Swal.fire('สำเร็จ', 'บันทึกข้อมูลผู้ใช้งานเรียบร้อย', 'success');

        // ✅ เปลี่ยนเป็นการกลับไปหน้า Manage User
        this.router.navigate(['/manage-user']); // ✅ นำผู้ใช้กลับไป

      },
      error: (error) => {
        console.error('❌ Error updating user:', error);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
      }
    });
  }
}
