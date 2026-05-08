import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleListComponent } from './vehicle-list';
import { VehicleService } from '../../services/vehicle';
import { signal } from '@angular/core';
import { vi } from 'vitest'; // Importamos o utilitário do Vitest

describe('VehicleListComponent', () => {
  let component: VehicleListComponent;
  let fixture: ComponentFixture<VehicleListComponent>;

  beforeEach(async () => {
    // Novo Mock: Simula perfeitamente o nosso Service que usa Signals
    const vehicleServiceMock = {
      loadVehicles: vi.fn(), // Substitui o antigo jasmine.createSpy
      vehicles: signal([]),
      isLoading: signal(false),
      error: signal(null)
    };

    await TestBed.configureTestingModule({
      imports: [VehicleListComponent],
      providers: [
        { provide: VehicleService, useValue: vehicleServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
