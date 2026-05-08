import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../models/vehicle';

@Component({
  selector: 'app-vehicle-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-table.component.html',
  styleUrls: ['./vehicle-table.component.css']
})
export class VehicleTableComponent {
  vehicles = input.required<Vehicle[]>();
  edit = output<Vehicle>();
  delete = output<Vehicle>();
}
