import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StepperModule } from 'primeng/stepper';
import { NewPartyRequest } from '../../interfaces/party.interface';
import { PartyService } from '../../services/party.service';
import { PartyDetailsFormComponent } from "./components/party-details-form/party-details-form.component";
import { PartyLocationFormComponent } from "./components/party-location-form/party-location-form.component";
import { PartySummaryComponent } from "./components/party-summary/party-summary.component";
import { StepperIconComponent } from "./components/stepper-icon/stepper-icon.component";

@Component({
  selector: 'app-create-party',
  imports: [ReactiveFormsModule, StepperModule, StepperIconComponent, PartyDetailsFormComponent, PartyLocationFormComponent, PartySummaryComponent],
  templateUrl: './create-party.page.html',
  styleUrl: './create-party.page.scss'
})
export class CreatePartyPage implements OnInit {
  activeIndex: number = 1;
  submitted = signal(false);
  partyMinDate: Date = new Date();
  partyMaxDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 2));
  username = signal<string | null>(null);

  newPartyForm!: FormGroup;

  constructor(private fb: FormBuilder, private partyService: PartyService, private router: Router) { }

  ngOnInit(): void {
    this.newPartyForm = this.fb.group({
      partyDetails: this.fb.group({}),
      partyLocation: this.fb.group({}),
    });
  }

  activateStep(step: number): void {
    this.activeIndex = step;
  }

  onPartyDetailsFormUpdated(formGroup: FormGroup): void {
    this.newPartyForm.setControl('partyDetails', formGroup);
  }

  onPartyLocationFormUpdated(formGroup: FormGroup): void {
    this.newPartyForm.setControl('partyLocation', formGroup);
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
        }
      });
    } else {
      this.markAllFormControlAsTouched();
      this.markAllFormControlAsDirty();
    }
  }

  mapFormToRequest(): NewPartyRequest {
    const partyDetails = this.newPartyForm.get('partyDetails')?.value;
    const partyLocation = this.newPartyForm.get('partyLocation')?.value;

    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(partyDetails.date, 'yyyy-MM-dd');
    const formattedStartTime = datePipe.transform(partyDetails.startTime, 'HH:mm:ss');
    const formattedEndTime = datePipe.transform(partyDetails.endTime, 'HH:mm:ss');

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
        country: partyLocation.country || ''
      }
    };
  }

  private markAllFormControlAsTouched(): void {
    Object.keys(this.newPartyForm.controls).forEach(key => {
      const control = this.newPartyForm.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    })
  }

  private markAllFormControlAsDirty(): void {
    Object.keys(this.newPartyForm.controls).forEach(key => {
      const control = this.newPartyForm.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupAsDirty(control);
      } else {
        control?.markAsDirty();
      }
    })
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
      control?.markAsTouched();
    })
  }

  private markFormGroupAsDirty(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupAsDirty(control);
      }
      control?.markAsDirty();
    })
  }

  get partyName(): string {
    return this.newPartyForm.get('partyDetails')?.get('name')?.value ||
      (this.username() ? `${this.username()}'s party` : '');
  }
}
