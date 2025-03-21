import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { UserLoginRequest } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
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
    CheckboxModule,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    keepLogged: new FormControl(false),
  });

  submitted = signal(false);
  errorMessage = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.submitted.set(true);

    if (this.loginForm.valid) {
      const userLoginRequest: UserLoginRequest = {
        email: this.loginForm.get('email')!.value!,
        password: this.loginForm.get('password')!.value!,
      };

      this.authService.login(userLoginRequest).subscribe({
        next: () => this.router.navigate(['/']),
        error: (error) => {
          console.error(error);
          this.errorMessage.set('Invalid email or password'); //TODO, make error message appear on the screen
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.loginForm.markAsDirty();
    }
  }
}