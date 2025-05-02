import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DatePickerModule } from 'primeng/datepicker';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { UserForgotPasswordRequest } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-password',
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
  ],
  templateUrl: './forgot-password.page.html',
  styleUrl: './forgot-password.page.scss',
  providers: [DatePipe],
})
export class ForgotPasswordPage {
  recoverPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    birthDate: new FormControl('', [Validators.required]),
  });

  submitted = false;
  valid = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  onSubmit() {
    this.submitted = true;

    if (this.recoverPasswordForm.valid) {
      this.valid = true;
      const userForgotPasswordRequest: UserForgotPasswordRequest = {
        email: this.recoverPasswordForm.get('email')!.value!,
        birthDate: this.datePipe.transform(
          this.recoverPasswordForm.get('birthDate')!.value!,
          'yyyy-MM-dd'
        )!,
      };
      this.authService.forgotPassword(userForgotPasswordRequest).subscribe({
        next: () => {},
      });
    } else {
      this.recoverPasswordForm.markAllAsTouched();
      this.recoverPasswordForm.markAsDirty();
    }
  }
}
