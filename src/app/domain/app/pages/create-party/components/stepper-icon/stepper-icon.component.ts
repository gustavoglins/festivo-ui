import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stepper-icon',
  imports: [CommonModule],
  templateUrl: './stepper-icon.component.html',
  styleUrl: './stepper-icon.component.scss'
})
export class StepperIconComponent {
  icon = input<string>('');
  active = input<boolean>(false);
  inactive = input<boolean>(false);
  completed = input<boolean>(false);
}
