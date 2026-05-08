import { Component } from '@angular/core';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [VehicleListComponent],
  templateUrl: './app.html'
})
export class App {}
