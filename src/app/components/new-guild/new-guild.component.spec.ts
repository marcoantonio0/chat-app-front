import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGuildComponent } from './new-guild.component';

describe('NewGuildComponent', () => {
  let component: NewGuildComponent;
  let fixture: ComponentFixture<NewGuildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewGuildComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGuildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
