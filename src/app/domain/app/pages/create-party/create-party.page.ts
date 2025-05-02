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

  // Method to set
  onPartyDetailsFormUpdated(formGroup: FormGroup): void {
    this.newPartyForm.setControl('partyDetails', formGroup);
  }

  onPartyLocationFormUpdated(formGroup: FormGroup): void {
    this.newPartyForm.setControl('partyLocation', formGroup);
  }

  onPartyMediaFormUpdated(formGroup: FormGroup): void {
    this.newPartyForm.setControl('partyMedia', formGroup);
  }

  onCreteParty(): void {
    if (this.newPartyForm.valid) {
      const newPartyRequest: NewPartyRequest = this.mapFormToRequest();

      this.partyService.createParty(newPartyRequest).subscribe({
        next: () => {
          this.router.navigate(['/my-parties']);
        },
        error: () => {
          console.error('Failed to create party');
        },
      });
    } else {
      this.markAllFormControlAsTouched();
      this.markAllFormControlAsDirty();
    }
  }

  mapFormToRequest(): NewPartyRequest {
    const partyDetails = this.newPartyForm.get('partyDetails')?.value;
    const partyLocation = this.newPartyForm.get('partyLocation')?.value;
    const partyMedia = this.newPartyForm.get('partyMedia')?.value;

    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(partyDetails.date, 'yyyy-MM-dd');
    const formattedStartTime = datePipe.transform(
      partyDetails.startTime,
      'HH:mm:ss'
    );
    const formattedEndTime = datePipe.transform(
      partyDetails.endTime,
      'HH:mm:ss'
    );

    const logoFile = partyMedia.get('logo')?.value;
    const bannerFile = partyMedia.get('banner')?.value;

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
      logo: partyMedia.logo || '',
      banner: partyMedia.banner || '',
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
      }
      control?.markAsDirty();
    });
  }

  get partyName(): string {
    return (
      this.newPartyForm.get('partyDetails')?.get('name')?.value ||
      (this.username() ? `${this.username()}'s party` : '')
    );
  }
}
