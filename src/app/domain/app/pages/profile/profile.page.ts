import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { of } from 'rxjs';
import { catchError, finalize, take } from 'rxjs/operators';
import { User, UserUpdateRequest } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';

import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-profile',
  standalone: true,
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
    FileUploadModule,
    DialogModule,
  ],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
})
export class ProfilePage implements OnInit {
  userForm!: FormGroup;
  isLoading = signal(true);
  submitted = signal(false);
  error = signal<string | null>(null);
  profilePicture: string | null = null;

  user: User = {
    id: 0,
    fullName: '',
    email: '',
    phoneNumber: '',
  };

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUserData();
    this.loadProfilePhoto();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      profilePicture: [''],
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
    });
  }

  private loadUserData(): void {
    this.isLoading.set(true);

    this.userService
      .getUser()
      .pipe(
        take(1),
        catchError((error) => {
          this.error.set('Error loading user data: ' + error.message);
          console.error('Error loading user:', error);
          return of(null);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((response) => {
        if (response) {
          this.user = response;
          this.userForm.patchValue({
            id: this.user.id,
            fullName: this.user.fullName,
            email: this.user.email,
            phoneNumber: this.user.phoneNumber,
          });
        }
      });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.userForm.markAsDirty();
      return;
    }

    this.submitted.set(true);

    const userUpdateRequest: UserUpdateRequest = {
      fullName: this.userForm.value.fullName,
      email: this.userForm.value.email,
      phoneNumber: this.userForm.value.phoneNumber,
    };

    this.userService
      .update(userUpdateRequest)
      .pipe(
        take(1),
        catchError((err) => {
          this.error.set('Erro ao atualizar usuário: ' + err.message);
          console.error('Erro ao atualizar usuário:', err);
          return of(null);
        }),
        finalize(() => this.submitted.set(false))
      )
      .subscribe((response) => {
        if (response) {
          this.user = response;
        }
      });
  }

  resetForm(): void {
    this.userForm.patchValue({
      id: this.user.id,
      fullName: this.user.fullName,
      email: this.user.email,
      phoneNumber: this.user.phoneNumber,
    });
  }

  onUpload(event: any) {
    const file = event.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this.userService.uploadProfilePicture(formData).subscribe({
      next: () => {
        this.loadProfilePhoto();
      },
      error: (error) => {
        console.error('Error uploading profile photo:', error);
      },
    });
  }

  loadProfilePhoto() {
    this.userService.loadProfilePicture().subscribe({
      next: (blob) => {
        const reader = new FileReader();
        reader.onload = () => (this.profilePicture = reader.result as string);
        reader.readAsDataURL(blob);
      },
      error: (error) => {
        console.error('Error loading profile photo:', error);
      },
    });
  }
}
