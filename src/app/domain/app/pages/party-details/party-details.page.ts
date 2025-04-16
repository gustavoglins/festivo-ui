import { Component, OnInit } from '@angular/core';
import { PartyCardComponent } from "../../components/party-card/party-card.component";
import { PartyDetailsResponse } from '../../interfaces/party.interface';
import { PartyService } from '../../services/party.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-party-details',
  imports: [PartyCardComponent],
  templateUrl: './party-details.page.html',
  styleUrl: './party-details.page.scss'
})
export class PartyDetailsPage implements OnInit {
  party!: PartyDetailsResponse;
  partyId: string | null = '';
  constructor(private partyService: PartyService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.partyId = this.route.snapshot.paramMap.get('id');

    if (this.partyId) {
      this.partyService.getPartyDetails(this.partyId).subscribe({
        next: (party) => {
          this.party = party;
        },
        error: (error) => console.error(error),
      });
    } else {
      console.log('No party id found in route.');
    }
  }
}
