import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-formdetail',
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
  ],
  templateUrl: './formdetail.component.html',
  styleUrls: ['./formdetail.component.css'] 
})
export class FormdetailComponent implements OnInit {

  formTitle = 'แบบฟอร์ม';
  formDetails!: FormGroup;
  form!: FormGroup;
  groupId!: string;

  apiUrl = 'http://192.168.10.53:3000';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.groupId = params.get('id') || '';
      console.log('📝 Form ID:', this.groupId);

      if (this.groupId) {
        this.fetchFormDetails();
      }
    });

    this.formDetails = this.fb.group({
      group_name: ['', Validators.required],
      group_description: [''],
    });

    this.form = this.fb.group({
      questions: this.fb.array([]),
    });
  }

 
  goBack() {
    this.location.back();
  }

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }


  addQuestion() {
    this.questions.push(this.createQuestionGroup());
  }

 
  removeQuestion(index: number) {
    if (this.questions.length > 1) {
      this.questions.removeAt(index);
    } else {
      this.showModal('ต้องมีอย่างน้อย 1 คำถาม', 'warning');
    }
  }

 
  addAnswer(questionIndex: number) {
    this.getQuestionOptions(questionIndex).push(this.createOptionGroup());
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    const questionAnswers = this.getQuestionOptions(questionIndex);
    if (questionAnswers.length > 1) {
      questionAnswers.removeAt(answerIndex);
    } else {
      this.showModal('ต้องมีคำตอบอย่างน้อยหนึ่งคำตอบ', 'warning');
    }
  }

 
  getQuestionOptions(index: number): FormArray {
    return this.questions.at(index).get('question_options') as FormArray;
  }


  createQuestionGroup(question: any = {}): FormGroup {
    return this.fb.group({
      question_id: [question.question_id || null],
      question_text: [question.question_text || '', Validators.required],
      is_correct: [question.is_correct || null], // ✅ ใช้ option_id ของตัวเลือกที่ถูกต้อง
      question_options: this.fb.array(
        (question.question_options || []).map((option: any) => this.createOptionGroup(option))
      )
    });
  }
  

  createOptionGroup(option: any = {}): FormGroup {
    return this.fb.group({
      option_id: [option.option_id || null],
      question_options_text: [option.question_options_text || '', Validators.required],
      is_correct: [option.is_correct ?? false], // ✅ ต้องแน่ใจว่า is_correct มีค่าเสมอ
    });
  }
  

  fetchFormDetails() {
    this.http.get<any>(`${this.apiUrl}/manage_form`).subscribe(
      (response) => {
        console.log('✅ API Response:', response);
  
        if (response && response.formData) {
          const form = response.formData.find((item: any) => item.group_id == this.groupId);
          if (form) {
            console.log('✅ ฟอร์มที่โหลด:', form);
  
            this.formDetails.patchValue({
              group_name: form.group_name || '',
              group_description: form.group_description || '',
            });
  
            const questionsArray = this.form.get('questions') as FormArray;
            questionsArray.clear();
  
            if (form.questions && form.questions.length > 0) {
              form.questions.forEach((question: any) => {
                // หา option_id ของตัวเลือกที่ถูกต้อง
                const correctOptionId = question.options.find((opt: any) => opt.is_correct)?.option_id || null;
  
                const questionData = {
                  question_id: question.question_id,
                  question_text: question.question_text,
                  is_correct: correctOptionId, // ✅ ใช้ option_id ของตัวเลือกที่ถูกต้อง
                  question_options: question.options.map((option: any) => ({
                    option_id: option.option_id,
                    question_options_text: option.option_text
                  }))
                };
                console.log('📌 เพิ่มคำถามเข้า FormArray:', questionData);
                questionsArray.push(this.createQuestionGroup(questionData));
              });
            } else {
              console.warn('⚠️ ไม่มีคำถามใน API Response');
            }
          } else {
            console.warn('⚠️ ไม่พบฟอร์มที่มี ID:', this.groupId);
          }
        } else {
          console.warn('⚠️ API Response ผิดพลาด');
        }
      },
      (error) => {
        console.error('❌ Error fetching form details:', error);
        this.showModal('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
      }
    );
  }
  
  submitForm() {
  if (this.form.invalid || this.formDetails.invalid) {
    this.showModal('กรุณากรอกข้อมูลให้ครบ', 'warning');
    return;
  }

  console.log('🔍 ตรวจสอบ groupId ก่อนส่ง API:', this.groupId);
  if (!this.groupId) {
    this.showModal('เกิดข้อผิดพลาด: ไม่มี Group ID', 'error');
    return;
  }

  const formData = {
    group_id: this.groupId, 
    group_name: this.formDetails.get('group_name')?.value.trim(),
    group_description: this.formDetails.get('group_description')?.value.trim() || '',
    questions: this.questions.value.map((question: any) => ({
      question_text: question.question_text?.trim(),
      question_options: (question.question_options || []).map((option: any) => ({
        question_options_text: option.question_options_text?.trim(),
        is_correct: option.is_correct // ✅ ต้องแน่ใจว่า is_correct ถูกส่งไป
      }))
    }))
  };

  console.log('📌 Data ที่จะส่งไปยัง API:', JSON.stringify(formData, null, 2));

  if (!formData.questions || formData.questions.length === 0) {
    console.error('❌ ข้อมูล questions ว่างเปล่า!');
    this.showModal('กรุณาเพิ่มคำถามก่อนส่งฟอร์ม', 'error');
    return;
  }

  const apiUrl = `${this.apiUrl}/update_form/${this.groupId}`;
  this.http.put(apiUrl, formData).subscribe(
    (response) => {
      console.log('✅ Form updated successfully:', response);
      this.showModal('อัปเดตข้อมูลสำเร็จ', 'success');
      this.router.navigate(['/manage-forms']);
    },
    (error) => {
      console.error('❌ Error updating form:', error);
      this.showModal(`เกิดข้อผิดพลาด: ${error.message}`, 'error');
    }
  );
}

  
  showModal(message: string, icon: 'success' | 'error' | 'warning' = 'warning') {
    Swal.fire({
      title: message,
      icon: icon,
      confirmButtonText: 'ตกลง',
    });
  }
} 