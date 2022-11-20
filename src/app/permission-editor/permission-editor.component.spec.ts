import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionEditorComponent } from './permission-editor.component';

describe('PermissionEditorComponent', () => {
  let component: PermissionEditorComponent;
  let fixture: ComponentFixture<PermissionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
