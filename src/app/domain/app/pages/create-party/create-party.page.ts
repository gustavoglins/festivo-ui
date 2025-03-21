import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { OrderListModule } from 'primeng/orderlist';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { StepperModule } from 'primeng/stepper';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { EventDetailsResponse, NewEventRequest } from '../../interfaces/event.interface';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-create-party',
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextModule,
    DatePickerModule,
    InputMaskModule,
    CalendarModule,
    PasswordModule,
    ToastModule,
    RouterModule,
    StepperModule,
    FormsModule,
    InputNumberModule,
    TooltipModule,
    FileUploadModule,
    PanelModule,
    OrderListModule,
    ImageModule,
  ],
  templateUrl: './create-party.page.html',
  styleUrls: ['./create-party.page.scss'],
})
export class CreatePartyPage implements OnInit {
  private readonly TWO_YEARS_IN_DAYS = 730;

  newEventForm = new FormGroup({
    eventDetails: new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
    }),
    eventDateTime: new FormGroup({
      date: new FormControl('', Validators.required),
      startsAt: new FormControl('', Validators.required),
      endsAt: new FormControl('', Validators.required),
    }),
    eventLocation: new FormGroup({
      address: new FormControl('', Validators.required),
      number: new FormControl('', Validators.required),
      complement: new FormControl(''),
      neighborhood: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      postalCode: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{5}-[0-9]{3}$'),
      ]),
      country: new FormControl('', Validators.required),
    }),
    eventMedia: new FormGroup({
      eventLogo: new FormControl(''),
      eventBanner: new FormControl(''),
    }),
    guests: new FormGroup({}),
  });
  submitted = signal(false);
  activeIndex: number = 1;
  eventMinDate: Date = new Date();
  eventMaxDate: Date = new Date();
  username = signal<string | null>(null);

  // Properties to hold the preview images
  eventLogo: string | null = null;
  eventBanner: string | null = null;

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.eventMinDate.setDate(this.eventMinDate.getDate());
    this.eventMaxDate.setDate(
      this.eventMaxDate.getDate() + this.TWO_YEARS_IN_DAYS
    );
  }

  activateStep(step: number) {
    this.activeIndex = step;
  }

  onCreateParty() {
    this.submitted.set(true);
    if (this.newEventForm.valid) {
      const newEventRequest: NewEventRequest = {
        name: this.newEventForm.get('eventDetails.name')?.value || '',
        description: this.newEventForm.get('eventDetails.description')?.value || '',
        date: new Date(this.newEventForm.get('eventDateTime.date')!.value!),
        startTime: new Date(this.newEventForm.get('eventDateTime.startsAt')!.value!),
        endTime: new Date(this.newEventForm.get('eventDateTime.endsAt')!.value!),
        address: {
          address: this.newEventForm.get('eventLocation.address')!.value!,
          number: this.newEventForm.get('eventLocation.number')!.value!,
          complement: this.newEventForm.get('eventLocation.complement')!.value!,
          neighborhood: this.newEventForm.get('eventLocation.neighborhood')!.value!,
          city: this.newEventForm.get('eventLocation.city')!.value!,
          state: this.newEventForm.get('eventLocation.state')!.value!,
          postalCode: this.newEventForm.get('eventLocation.postalCode')!.value!,
          country: this.newEventForm.get('eventLocation.country')!.value!,
        },
        eventLogo: this.newEventForm.get('eventMedia.eventLogo')?.value || '',
        eventBanner: this.newEventForm.get('eventMedia.eventBanner')?.value || '',
        guests: [],
      }

      console.log(newEventRequest);
      this.eventService.createEvent(newEventRequest).subscribe({
        next: (response: EventDetailsResponse) => {
          console.log(response);
        },
        error: (error) => {
          console.error(error);
        },
      });
    } else {
      this.newEventForm.markAllAsTouched();
      this.newEventForm.markAsDirty();
    }
  }

  onUploadEventLogo(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.eventLogo = reader.result as string;
      this.newEventForm.controls.eventMedia?.get('eventLogo')?.setValue(this.eventLogo);
    };
    reader.readAsDataURL(file);
  }

  onUploadEventBanner(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.eventBanner = reader.result as string; 
      this.newEventForm.controls.eventMedia?.get('eventBanner')?.setValue(this.eventBanner);
    };
    reader.readAsDataURL(file);
  }

  get eventName() {
    return (
      this.newEventForm.get('eventDetails.name')?.value ||
      this.username() + "'s Event"
    );
  }

  get eventDescription() {
    return (
      this.newEventForm.get('eventDetails.description')?.value ||
      'No description'
    );
  }

  get eventDate() {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const eventDayValue =
      this.newEventForm.controls.eventDateTime.controls.date.value;

    if (eventDayValue !== null) {
      const eventDate = new Date(eventDayValue);
      const formattedDate =
        eventDayValue && !isNaN(eventDate.getTime())
          ? new Intl.DateTimeFormat('en-US', {
            timeZone,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(eventDate)
          : 'No Event Day';

      return formattedDate;
    } else {
      return '';
    }
  }

  get eventStartTime() {
    const startTimeValue =
      this.newEventForm.controls.eventDateTime.controls.startsAt.value;

    if (startTimeValue !== null) {
      const startDate = new Date(startTimeValue);
      const formattedTime =
        startTimeValue && !isNaN(startDate.getTime())
          ? new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(startDate)
          : 'No Start Time';

      return formattedTime;
    } else {
      return '';
    }
  }

  get eventEndTime() {
    const endTimeValue =
      this.newEventForm.controls.eventDateTime.controls.endsAt.value;

    if (endTimeValue !== null) {
      const endDate = new Date(endTimeValue);
      const formattedTime =
        endTimeValue && !isNaN(endDate.getTime())
          ? new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(endDate)
          : 'No End Time';
      return formattedTime;
    } else {
      return '';
    }
  }

  get eventAddress() {
    const address = this.newEventForm.get('eventLocation.address')?.value;
    const number = this.newEventForm.get('eventLocation.number')?.value;
    return address && number ? `${address}, ${number}` : 'No address';
  }

  get eventComplement() {
    return (
      this.newEventForm.get('eventLocation.complement')?.value ||
      'No complement'
    );
  }

  get eventNeighborhood() {
    return (
      this.newEventForm.get('eventLocation.neighborhood')?.value ||
      'No neighborhood'
    );
  }

  get eventCityAndState() {
    const city = this.newEventForm.get('eventLocation.city')?.value;
    const state = this.newEventForm.get('eventLocation.state')?.value;
    return city && state ? `${city} - ${state}` : 'No city and state';
  }

  get eventPostalCode() {
    return (
      this.newEventForm.get('eventLocation.postalCode')?.value ||
      'No postal code'
    );
  }

  get eventLogoControl() {
    return this.newEventForm.get('eventMedia.eventLogo')?.value || 'No logo';
  }

  get eventBannerControl() {
    return (
      this.newEventForm.get('eventMedia.eventBanner')?.value || 'No banner'
    );
  }

  get eventGuests() {
    return [];
  }
}
