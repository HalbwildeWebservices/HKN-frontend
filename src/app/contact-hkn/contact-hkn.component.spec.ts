import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactHKNComponent } from './contact-hkn.component';

describe('ContactHKNComponent', () => {
  let component: ContactHKNComponent;
  let fixture: ComponentFixture<ContactHKNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactHKNComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactHKNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
