import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { VehicleService } from './vehicle';
import { Vehicle } from '../models/vehicle';

describe('VehicleService', () => {
  let service: VehicleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VehicleService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(VehicleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve carregar veículos e atualizar os signals de estado', () => {
    const mockVehicles: Vehicle[] = [
      { id: 1, placa: 'ABC1D23', chassi: '9BWZZZ', renavam: '123', modelo: 'Civic', marca: 'Honda', ano: 2022 }
    ];

    service.loadVehicles();

    expect(service.isLoading()).toBe(true);

    const req = httpMock.expectOne('assets/vehicles.json');
    expect(req.request.method).toBe('GET');

    req.flush(mockVehicles);

  });
});
