import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { PartyCardComponent } from '../../components/party-card/party-card.component';
import { PartyDetailsResponse } from '../../interfaces/party.interface';
import { PartyService } from '../../services/party.service';

@Component({
    selector: 'app-my-parties',
    imports: [CardModule, ButtonModule, DataViewModule, PartyCardComponent],
    templateUrl: './my-parties.page.html',
    styleUrl: './my-parties.page.scss',
})
export class MyPartiesPage implements OnInit {
    layout: string = 'grid';
    parties = signal<PartyDetailsResponse[]>([]);

    constructor(private partyService: PartyService, private router: Router) {}

    ngOnInit(): void {
        this.partyService.getUserParties().subscribe({
            next: (parties) => {
                this.parties.set(parties);
            },
            error: (error) => console.error(error),
        });

        // console.log(this.parties());
    }

    onSelectParty(id: string) {
        this.router.navigate(['/party/' + id]);
    }
}
