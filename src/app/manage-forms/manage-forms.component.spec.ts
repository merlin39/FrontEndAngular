import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFormsComponent } from './manage-forms.component';

describe('ManageFormsComponent', () => {
  let component: ManageFormsComponent;
  let fixture: ComponentFixture<ManageFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageFormsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
