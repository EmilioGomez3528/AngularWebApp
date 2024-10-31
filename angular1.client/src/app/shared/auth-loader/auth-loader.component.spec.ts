import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLoaderComponent } from './auth-loader.component';

describe('AuthLoaderComponent', () => {
  let component: AuthLoaderComponent;
  let fixture: ComponentFixture<AuthLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthLoaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
