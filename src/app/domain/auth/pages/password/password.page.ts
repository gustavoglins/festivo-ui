import { CommonModule } from '@angular/common';
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
  templateUrl: './password.page.html',
  styleUrl: './password.page.scss'
})
export class PasswordPage {
  recoverPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    birthDate: new FormControl('', [Validators.required]),
  });

  submitted = false;

  constructor(private authService: AuthService, private router: Router){}

  onSubmit() {
    this.submitted = true;

    if(this.recoverPasswordForm.valid){
      // this.authService.recoverPassword(); //TODO
    } else {
      this.recoverPasswordForm.markAllAsTouched();
      this.recoverPasswordForm.markAsDirty();
    }
  }
}
