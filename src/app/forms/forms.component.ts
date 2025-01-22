import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FormsComponent {
  formTitle = 'แบบฟอร์ม';
  
  formDetails = new FormGroup({
    formName: new FormControl(''),
    formDescription: new FormControl('')
  });


  form = new FormGroup({
    answers: new FormGroup({})
  });

  questions = [
    {
      question: 'คำถามไม่มีระบุชื่อ',
      type: 'radio',
      options: ['ตัวเลือกที่ 1']
    }
  ];

  constructor(private location: Location) {
    this.initializeAnswers();
  }

  goBack() {
    this.location.back();
  }

  initializeAnswers() {
    this.questions.forEach((_, index) => {
      (this.form.get('answers') as FormGroup).addControl(`answer${index}`, new FormControl(''));
    });
  }

  addQuestion() {
    this.questions.push({
      question: 'คำถามใหม่',
      type: 'text',
      options: []
    });

    const index = this.questions.length - 1;
    (this.form.get('answers') as FormGroup).addControl(`answer${index}`, new FormControl(''));
  }

  changeQuestionType(index: number, type: string) {
    this.questions[index].type = type;
    if (type === 'radio') {
      this.questions[index].options = ['ตัวเลือก 1', 'ตัวเลือก 2'];
    } else {
      this.questions[index].options = [];
    }
  }

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
    (this.form.get('answers') as FormGroup).removeControl(`answer${index}`);
  }
}