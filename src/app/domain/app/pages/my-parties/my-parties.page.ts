import { Component, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { PartyDetailsResponse } from '../../interfaces/party.interface';
import { PartyService } from '../../services/party.service';
import { PartyCardComponent } from "../../components/party-card/party-card.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-parties',
  imports: [CardModule, ButtonModule, DataViewModule, PartyCardComponent],
  templateUrl: './my-parties.page.html',
  styleUrl: './my-parties.page.scss'
})
export class MyPartiesPage implements OnInit {
  layout: string = 'grid';
  parties = signal<PartyDetailsResponse[]>([]);

  constructor(private partyService: PartyService, private router: Router) { }

  ngOnInit(): void {
    this.partyService.getUserParties().subscribe({
      next: (parties) => {
        this.parties.set(parties);
      },
      error: (error) => console.error(error),
    });
  }
  
  onSelectParty(id: string){
    this.router.navigate(['/party/' + id]);
  }
}
