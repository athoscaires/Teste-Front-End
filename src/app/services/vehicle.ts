import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Vehicle } from '../models/vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private http = inject(HttpClient);
  private dataUrl = 'assets/vehicles.json';

  vehicles = signal<Vehicle[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  loadVehicles(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.get<Vehicle[]>(this.dataUrl).pipe(
      delay(500),
      tap((data) => {
        this.vehicles.set(data);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        console.error('Erro ao buscar dados:', err);
        this.error.set('Não foi possível carregar a lista de veículos. Tente novamente.');
        this.isLoading.set(false);
        return of([]);
      })
    ).subscribe();
  }

  deleteVehicle(id: number): void {
    this.isLoading.set(true);

    setTimeout(() => {
      this.vehicles.update((currentVehicles) =>
        currentVehicles.filter(vehicle => vehicle.id !== id)
      );
      this.isLoading.set(false);
    }, 600);
  }

  updateVehicle(updatedVehicle: Vehicle): void {
    this.isLoading.set(true);

    setTimeout(() => {
      this.vehicles.update((currentVehicles) =>
        currentVehicles.map(vehicle =>
          vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
        )
      );
      this.isLoading.set(false);
    }, 600);
  }

  addVehicle(newVehicle: Omit<Vehicle, 'id'>): void {
    this.isLoading.set(true);

    setTimeout(() => {
      const currentList = this.vehicles();

      // Gera um ID sequencial falso baseado no maior ID existente
      const newId = currentList.length > 0
        ? Math.max(...currentList.map(v => v.id)) + 1
        : 1;

      // Monta o objeto final e atualiza o Signal inserindo no final da lista
      const vehicleWithId = { ...newVehicle, id: newId } as Vehicle;
      this.vehicles.update(vehicles => [...vehicles, vehicleWithId]);

      this.isLoading.set(false);
    }, 600);
  }

}
