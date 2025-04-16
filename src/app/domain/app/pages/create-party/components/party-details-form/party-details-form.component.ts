import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-party-details-form',
  imports: [ReactiveFormsModule, InputTextModule, CommonModule, DatePickerModule, ButtonModule],
  templateUrl: './party-details-form.component.html',
  styleUrl: './party-details-form.component.scss'
})
export class PartyDetailsFormComponent implements OnInit {
  partyMinDate = input<Date>();
  partyMaxDate = input<Date>();
  submitted = input<boolean>(false);

  formUpdated = output<FormGroup>();
  nextStep = output<void>();

  detailsForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit(): void {
    this.formUpdated.emit(this.detailsForm);
    this.detailsForm.valueChanges.subscribe(() => {
      this.formUpdated.emit(this.detailsForm);
    });
  }

  private createForm(): void {
    this.detailsForm = this.fb.group({
      name: [''],
      description: [''],
      date: [''],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  onNext() {
    this.nextStep.emit();
  }
}
