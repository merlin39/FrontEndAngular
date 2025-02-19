import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MatRadioModule } from '@angular/material/radio';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatRadioModule
  ]
})
export class FormsComponent {
  formTitle = 'แบบฟอร์ม';
  formDetails: FormGroup;
  form: FormGroup;

  apiUrl = 'http://192.168.10.53:3000/forms-with-questions-and-question_options';

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private authService: AuthService
  ) {
    this.formDetails = this.fb.group({
      group_name: ['', Validators.required],
      group_description: [''],
    });

    this.form = this.fb.group({
      questions: this.fb.array([]),
    });

    this.addQuestion();
  }

  goBack() {
    this.location.back();
  }

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  getQuestionOptions(index: number): FormArray {
    return this.questions.at(index).get('question_options') as FormArray;
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    const questionAnswers = this.getQuestionOptions(questionIndex);
    if (questionAnswers.length > 1) {
      questionAnswers.removeAt(answerIndex);
    } else {
      this.showModal('ต้องมีคำตอบอย่างน้อยหนึ่งคำตอบ');
    }
  }

  addAnswer(index: number) {
    const questionAnswers = this.getQuestionOptions(index);
    questionAnswers.push(this.createOptionGroup());
  }

  addQuestion() {
    this.questions.push(this.createQuestionGroup());
  }

  removeQuestion(index: number) {
    if (this.questions.length > 1) {
      this.questions.removeAt(index);
    } else {
      this.showModal('ต้องมีอย่างน้อย 1 คำถาม');
    }
  }

  createQuestionGroup(): FormGroup {
    return this.fb.group({
      question_text: ['', Validators.required],
      question_type: ['multiple choice', Validators.required],
      status: [true],
      question_options: this.fb.array([
        this.createOptionGroup()
      ])
    });
  }

  createOptionGroup(): FormGroup {
    return this.fb.group({
      question_options_text: ['', Validators.required],
      is_correct: [0]
    }, { updateOn: 'change' });
  }

  submitForm() {
    console.log('ค่าของฟอร์มที่กำลังส่ง:', JSON.stringify(this.form.value, null, 2));
  
    const userId = this.authService.getUserId() || localStorage.getItem('user_id');
    if (!userId) {
      this.showModal('กรุณาเข้าสู่ระบบก่อนส่งฟอร์ม', 'error');
      return;
    }
  
    const groupName = this.formDetails.get('group_name')?.value?.trim();
    if (!groupName) {
      this.showModal('กรุณากรอกชื่อแบบฟอร์ม', 'error');
      return;
    }
  
    const formData = {
      user_id: userId,
      group_name: groupName,
      group_description: this.formDetails.get('group_description')?.value?.trim() || '',
      questions: this.questions.value.map((question: any) => ({
        question_text: question.question_text?.trim() || '',
        question_type: question.question_type || 'multiple choice',
        status: question.status === true,
        question_options: question.question_options?.map((option: any) => ({
          question_options_text: option.question_options_text?.trim() || '',
          is_correct: option.is_correct === true
        }))
      }))
    };
  
    fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.error || `HTTP error! status: ${response.status}`); });
        }
        return response.json();
      })
      .then(data => {
        console.log('✅ ส่งฟอร์มสำเร็จ:', data);
        this.showModal('ส่งข้อมูลสำเร็จ', 'success');
  
        setTimeout(() => {
          this.router.navigate(['/manage-forms']).then(() => {
            window.location.reload(); 
          });
        }, 1500); 
      })
      .catch(error => {
        console.error('❌ เกิดข้อผิดพลาด:', error);
        this.showModal(`เกิดข้อผิดพลาด: ${error.message}`, 'error');
      });
  }
  
  showModal(message: string, icon: 'success' | 'error' | 'warning' = 'warning') {
    Swal.fire({
      title: message,
      icon: icon,
      draggable: true,
      allowOutsideClick: false,
      confirmButtonText: 'ตกลง'
    });
  }
}
