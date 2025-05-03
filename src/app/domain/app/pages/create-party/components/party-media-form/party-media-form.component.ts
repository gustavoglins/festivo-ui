import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-party-media-form',
  imports: [ReactiveFormsModule, FileUploadModule, ButtonModule, CommonModule],
  templateUrl: './party-media-form.component.html',
  styleUrl: './party-media-form.component.scss',
})
export class PartyMediaFormComponent implements OnInit {
  submitted = input<boolean>(false);
  uploadedFiles: any;

  formUpdated = output<FormGroup>();
  nextStep = output<void>();
  previousStep = output<void>();

  mediaForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit(): void {
    this.formUpdated.emit(this.mediaForm);
    this.mediaForm.valueChanges.subscribe(() => {
      this.formUpdated.emit(this.mediaForm);
    });
  }

  createForm(): void {
    this.mediaForm = this.fb.group({
      banner: [''],
    });
  }

  onNext() {
    this.nextStep.emit();
  }

  onPrevious() {
    this.previousStep.emit();
  }

  onFileSelect(event: any, field: 'banner') {
    const file = event.files?.[0];
    if (file) {
      this.mediaForm.patchValue({ [field]: file });
    }
  }
}
