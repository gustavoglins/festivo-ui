import { Component, input, OnInit, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PartyDetailsResponse } from '../../interfaces/party.interface';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-party-card',
  imports: [DatePipe, RouterModule, TagModule, ButtonModule],
  templateUrl: './party-card.component.html',
  styleUrl: './party-card.component.scss'
})
export class PartyCardComponent implements OnInit {
  party = input.required<PartyDetailsResponse>();
  
  selectedParty = output<string>();

  ngOnInit(): void {
    console.log(this.party());
  }
}
