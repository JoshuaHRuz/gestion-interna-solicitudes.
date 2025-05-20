import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesDashboardComponent } from './solicitudes-dashboard.component';

describe('SolicitudesDashboardComponent', () => {
  let component: SolicitudesDashboardComponent;
  let fixture: ComponentFixture<SolicitudesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
