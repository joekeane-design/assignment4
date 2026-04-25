import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBudget } from './edit-budget';

describe('EditBudget', () => {
  let component: EditBudget;
  let fixture: ComponentFixture<EditBudget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBudget],
    }).compileComponents();

    fixture = TestBed.createComponent(EditBudget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
