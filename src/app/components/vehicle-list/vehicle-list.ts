import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { VehicleService } from '../../services/vehicle';
import { VehicleTableComponent } from '../vehicle-table/vehicle-table.component';
import { Vehicle } from '../../models/vehicle';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, VehicleTableComponent, ReactiveFormsModule],
  templateUrl: './vehicle-list.html',
  styleUrls: ['./vehicle-list.css']
})
export class VehicleListComponent implements OnInit {
  vehicleService = inject(VehicleService);

  currentYear = new Date().getFullYear();
  maxYear = this.currentYear + 1;

  isModalOpen = signal<boolean>(false);
  isEditingMode = signal<boolean>(false);

  vehicleForm = new FormGroup({
    id: new FormControl<number | null>(null),
    marca: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ0-9\s\-]+$/)]),
    modelo: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ0-9\s\-]+$/)]),
    ano: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1950),
      Validators.max(this.maxYear)
    ]),
    placa: new FormControl('', [Validators.required, Validators.pattern(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i)]),
    renavam: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]),
    chassi: new FormControl('', [Validators.required, Validators.minLength(17)])
  });

  get f() { return this.vehicleForm.controls; }

  ngOnInit(): void {
    this.vehicleService.loadVehicles();
  }

  handleYearInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/[^0-9]/g, '');

    if ((value === '1' || value === '-1' || value === '') && event.inputType === 'insertReplacementText') {
      value = this.currentYear.toString();
    }

    if (value.length >= 4) {
      const numericValue = parseInt(value, 10);
      if (numericValue > this.maxYear) {
        value = this.maxYear.toString();
      }
    }

    input.value = value;
    this.vehicleForm.patchValue({ ano: value ? parseInt(value, 10) : null }, { emitEvent: false });
  }

  allowOnlyNumbers(event: Event, controlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const cleanValue = inputElement.value.replace(/[^0-9]/g, '');
    inputElement.value = cleanValue;
    this.vehicleForm.get(controlName)?.setValue(cleanValue, { emitEvent: false });
  }

  onAddVehicle(): void {
    this.isEditingMode.set(false);
    this.vehicleForm.reset();
    this.isModalOpen.set(true);
  }

  onEditVehicle(vehicle: Vehicle): void {
    this.isEditingMode.set(true);
    this.vehicleForm.patchValue(vehicle);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.vehicleForm.reset();
  }

  onSaveVehicle(): void {
    if (this.vehicleForm.valid) {
      const formValue = this.vehicleForm.value;
      if (this.isEditingMode()) {
        this.vehicleService.updateVehicle(formValue as Vehicle);
      } else {
        this.vehicleService.addVehicle(formValue as Omit<Vehicle, 'id'>);
      }
      this.closeModal();
    }
  }

  onDeleteVehicle(vehicle: Vehicle): void {
    if(confirm(`Deseja realmente excluir o veículo placa ${vehicle.placa}?`)) {
      this.vehicleService.deleteVehicle(vehicle.id);
    }
  }
}
