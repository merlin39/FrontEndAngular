import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormdetailComponent } from './formdetail.component';

describe('FormdetailComponent', () => {
  let component: FormdetailComponent;
  let fixture: ComponentFixture<FormdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormdetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
