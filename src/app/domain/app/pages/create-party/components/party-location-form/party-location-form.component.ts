import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-party-location-form',
  imports: [ReactiveFormsModule, InputTextModule, CommonModule, ButtonModule],
  templateUrl: './party-location-form.component.html',
  styleUrl: './party-location-form.component.scss'
})
export class PartyLocationFormComponent implements OnInit {
  submitted = input<boolean>(false);

  formUpdated = output<FormGroup>();
  nextStep = output<void>();
  previousStep = output<void>();

  locationForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit(): void {
    this.formUpdated.emit(this.locationForm);
    this.locationForm.valueChanges.subscribe(() => {
      this.formUpdated.emit(this.locationForm);
    });
  }

  createForm(): void {
    this.locationForm = this.fb.group({
      address: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  onNext() {
    this.nextStep.emit();
  }

  onPrevios(){
    this.previousStep.emit();
  }
}
