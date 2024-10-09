import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrphanUsersComponent } from './orphan-users.component';

describe('OrphanUsersComponent', () => {
  let component: OrphanUsersComponent;
  let fixture: ComponentFixture<OrphanUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrphanUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrphanUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
