import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StepperModule } from 'primeng/stepper';
import { NewPartyRequest } from '../../interfaces/party.interface';
import { PartyService } from '../../services/party.service';
import { PartyDetailsFormComponent } from './components/party-details-form/party-details-form.component';
import { PartyLocationFormComponent } from './components/party-location-form/party-location-form.component';
import { PartyMediaFormComponent } from './components/party-media-form/party-media-form.component';
import { PartySummaryComponent } from './components/party-summary/party-summary.component';
import { StepperIconComponent } from './components/stepper-icon/stepper-icon.component';

@Component({
    selector: 'app-create-party',
    imports: [
        ReactiveFormsModule,
        StepperModule,
        StepperIconComponent,
        PartyDetailsFormComponent,
        PartyLocationFormComponent,
        PartySummaryComponent,
        PartyMediaFormComponent,
    ],
    templateUrl: './create-party.page.html',
    styleUrl: './create-party.page.scss',
})
export class CreatePartyPage implements OnInit {
    activeIndex: number = 1; // Active step index
    submitted = signal(false); // Form submission status
    partyMinDate: Date = new Date(); // Minimum date for the party
    partyMaxDate: Date = new Date(
        new Date().setFullYear(new Date().getFullYear() + 2)
    ); // Maximum date for the party
    username = signal<string | null>(null); // Placeholder for username signal

    newPartyForm!: FormGroup; // Form group for the new party (with others forms)

    constructor(
        private fb: FormBuilder,
        private partyService: PartyService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.newPartyForm = this.fb.group({
            partyDetails: this.fb.group({}),
            partyLocation: this.fb.group({}),
            partyMedia: this.fb.group({}),
        });
    }

    // Method to handle step change
    activateStep(step: number): void {
        this.activeIndex = step;
    }

    // Method to update the details form data in HTML
    onPartyDetailsFormUpdated(formGroup: FormGroup): void {
        this.newPartyForm.setControl('partyDetails', formGroup);
    }

    // Method to update the loaction form data in HTML
    onPartyLocationFormUpdated(formGroup: FormGroup): void {
        this.newPartyForm.setControl('partyLocation', formGroup);
    }

    // Method to update the media form data in HTML
    onPartyMediaFormUpdated(formGroup: FormGroup): void {
        this.newPartyForm.setControl('partyMedia', formGroup);
    }

    onCreateParty(): void {
        if (this.newPartyForm.valid) {
            this.mapFormToRequest().then((newPartyRequest) => {
                this.partyService.createParty(newPartyRequest).subscribe({
                    next: () => this.router.navigate(['/my-parties']),
                    error: () => console.error('Failed to create party'),
                });
            });
        } else {
            this.markAllFormControlAsTouched();
            this.markAllFormControlAsDirty();
        }
    }

    async mapFormToRequest(): Promise<NewPartyRequest> {
        const partyDetails = this.newPartyForm.get('partyDetails')?.value;
        const partyLocation = this.newPartyForm.get('partyLocation')?.value;
        const partyMedia = this.newPartyForm.get('partyMedia')?.value;

        const datePipe = new DatePipe('en-US');
        const formattedDate = datePipe.transform(
            partyDetails.date,
            'yyyy-MM-dd'
        );
        const formattedStartTime = datePipe.transform(
            partyDetails.startTime,
            'HH:mm:ss'
        );
        const formattedEndTime = datePipe.transform(
            partyDetails.endTime,
            'HH:mm:ss'
        );

        // Verificar se há um arquivo de banner antes de tentar converter
        let bannerStr = '';
        if (partyMedia.banner instanceof File) {
            bannerStr = await this.fileToBase64(partyMedia.banner);
        }

        return {
            name: partyDetails.name,
            description: partyDetails.description,
            date: formattedDate!,
            startTime: formattedStartTime!,
            endTime: formattedEndTime!,
            address: {
                address: partyLocation.address || '',
                number: partyLocation.number || '',
                complement: partyLocation.complement || '',
                neighborhood: partyLocation.neighborhood || '',
                city: partyLocation.city || '',
                state: partyLocation.state || '',
                postalCode: partyLocation.postalCode || '',
                country: partyLocation.country || '',
            },
            banner: bannerStr,
        };
    }

    mapFormToRequest2(): NewPartyRequest {
        const partyDetails = this.newPartyForm.get('partyDetails')?.value;
        const partyLocation = this.newPartyForm.get('partyLocation')?.value;
        const partyMedia = this.newPartyForm.get('partyMedia')?.value;

        const datePipe = new DatePipe('en-US');
        const formattedDate = datePipe.transform(
            partyDetails.date,
            'yyyy-MM-dd'
        );
        const formattedStartTime = datePipe.transform(
            partyDetails.startTime,
            'HH:mm:ss'
        );
        const formattedEndTime = datePipe.transform(
            partyDetails.endTime,
            'HH:mm:ss'
        );

        // Se não houver arquivo de banner, não tente converter
        let bannerStr: string = '';

        return {
            name: partyDetails.name,
            description: partyDetails.description,
            date: formattedDate!,
            startTime: formattedStartTime!,
            endTime: formattedEndTime!,
            address: {
                address: partyLocation.address || '',
                number: partyLocation.number || '',
                complement: partyLocation.complement || '',
                neighborhood: partyLocation.neighborhood || '',
                city: partyLocation.city || '',
                state: partyLocation.state || '',
                postalCode: partyLocation.postalCode || '',
                country: partyLocation.country || '',
            },
            banner: bannerStr || '',
        };
    }

    private markAllFormControlAsTouched(): void {
        Object.keys(this.newPartyForm.controls).forEach((key) => {
            const control = this.newPartyForm.get(key);
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            } else {
                control?.markAsTouched();
            }
        });
    }

    private markAllFormControlAsDirty(): void {
        Object.keys(this.newPartyForm.controls).forEach((key) => {
            const control = this.newPartyForm.get(key);
            if (control instanceof FormGroup) {
                this.markFormGroupAsDirty(control);
            } else {
                control?.markAsDirty();
            }
        });
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach((key) => {
            const control = formGroup.get(key);
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
            control?.markAsTouched();
        });
    }

    private markFormGroupAsDirty(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach((key) => {
            const control = formGroup.get(key);
            if (control instanceof FormGroup) {
                this.markFormGroupAsDirty(control);
            } else {
                control?.markAsDirty();
            }
        });
    }

    get partyName(): string {
        return (
            this.newPartyForm.get('partyDetails')?.get('name')?.value ||
            (this.username() ? `${this.username()}'s party` : '')
        );
    }

    fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string); // result é a Base64
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file); // Lê o arquivo como Base64
        });
    }
}
