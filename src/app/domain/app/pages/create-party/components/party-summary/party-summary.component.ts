import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { NewPartyRequest } from '../../../../interfaces/party.interface';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-party-summary',
  imports: [
    PanelModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DatePipe,
    CommonModule,
  ],
  templateUrl: './party-summary.component.html',
  styleUrl: './party-summary.component.scss',
})
export class PartySummaryComponent {
  nextStep = output<void>();
  previousStep = output<void>();
  editDetailsStep = output<void>();
  editLocationStep = output<void>();
  editMediaStep = output<void>();

  partyData = input.required<NewPartyRequest>();
}
