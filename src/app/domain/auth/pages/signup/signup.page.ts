import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  AbstractControl,
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
import { UserSignupRequest } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';

function passwordsMatches(control: AbstractControl) {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password === confirmPassword) {
    return null;
  }

  return { passwordsDoNotMatch: true };
}

@Component({
  selector: 'app-signup',
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
  standalone: true,
  templateUrl: './signup.page.html',
  styleUrl: './signup.page.scss',
  providers: [DatePipe],
})
export class SignupPage {
  signupForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    passwords: new FormGroup(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      { validators: passwordsMatches }
    ),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
    ]),
    birthDate: new FormControl('', Validators.required),
  });
  submitted = false;
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  onSubmit() {
    this.submitted = true;

    if (this.signupForm.valid) {
      const userSignupRequest: UserSignupRequest = {
        fullName: this.signupForm.get('fullName')!.value!,
        email: this.signupForm.get('email')!.value!,
        password: this.signupForm.get('passwords.password')!.value!,
        phoneNumber: this.signupForm.get('phoneNumber')!.value!,
        birthDate: this.datePipe.transform(
          this.signupForm.get('birthDate')!.value!,
          'yyyy-MM-dd'
        )!,
      };

      this.authService.signup(userSignupRequest).subscribe({
        next: () => this.router.navigate(['/']),
        error: (error) => {
          console.error(error);
          this.errorMessage.set(error.error.message);
        },
      });
    } else {
      this.signupForm.markAllAsTouched();
      this.signupForm.markAsDirty();
    }
  }
}

// import { CommonModule, DatePipe } from '@angular/common';
// import { Component } from '@angular/core';
// import {
//   AbstractControl,
//   FormControl,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { ButtonModule } from 'primeng/button';
// import { CalendarModule } from 'primeng/calendar';
// import { DatePickerModule } from 'primeng/datepicker';
// import { InputGroupModule } from 'primeng/inputgroup';
// import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
// import { InputMaskModule } from 'primeng/inputmask';
// import { InputTextModule } from 'primeng/inputtext';
// import { PasswordModule } from 'primeng/password';
// import { ToastModule } from 'primeng/toast';
// import { LocalStorageService } from '../../../../core/services/local-storage.service';
// import { UserSignupRequest } from '../../interfaces/user.interface';
// import { AuthService } from '../../services/auth.service';

// function passwordsMatches(control: AbstractControl) {
//   const password = control.get('password')?.value;
//   const confirmPassword = control.get('confirmPassword')?.value;

//   if (password === confirmPassword) {
//     return null;
//   }

//   return { passwordsDoNotMatch: true };
// }

// @Component({
//   selector: 'app-signup',
//   imports: [
//     CommonModule,
//     ButtonModule,
//     ReactiveFormsModule,
//     InputGroupAddonModule,
//     InputGroupModule,
//     InputTextModule,
//     DatePickerModule,
//     InputMaskModule,
//     CalendarModule,
//     PasswordModule,
//     ToastModule,
//     RouterModule,
//   ],
//   standalone: true,
//   templateUrl: './signup.page.html',
//   styleUrl: './signup.page.scss',
//   providers: [DatePipe],
// })
// export class SignupPage {
//   signupForm = new FormGroup({
//     fullName: new FormControl('', Validators.required),
//     email: new FormControl('', [Validators.required, Validators.email]),
//     passwords: new FormGroup(
//       {
//         password: new FormControl('', [
//           Validators.required,
//           Validators.minLength(8),
//         ]),
//         confirmPassword: new FormControl('', [
//           Validators.required,
//           Validators.minLength(8),
//         ]),
//       },
//       { validators: passwordsMatches }
//     ),
//     phoneNumber: new FormControl('', [
//       Validators.required,
//       Validators.minLength(11),
//     ]),
//     birthDate: new FormControl('', Validators.required),
//   });

//   submitted = false;

//   constructor(
//     private authService: AuthService,
//     private datePipe: DatePipe,
//     private router: Router,
//     private localStorageService: LocalStorageService
//   ) {}

//   onSubmit() {
//     this.submitted = true;

//     if (this.signupForm.valid) {
//       const userSignupRequest: UserSignupRequest = {
//         fullName: this.signupForm.get('fullName')!.value!,
//         email: this.signupForm.get('email')!.value!,
//         password: this.signupForm.get('passwords.password')!.value!,
//         phoneNumber: this.signupForm.get('phoneNumber')!.value!,
//         birthDate: this.datePipe.transform(
//           this.signupForm.get('birthDate')!.value!,
//           'yyyy-MM-dd'
//         )!,
//       };

//       this.authService.signup(userSignupRequest).subscribe({
//         next: (response) => {
//           this.localStorageService.setItem('authToken', response.token);
//           this.router.navigate(['/']);
//         },
//         error: (error) => {
//           console.error(error);
//         },
//       });
//     } else {
//       this.signupForm.markAllAsTouched();
//       this.signupForm.markAsDirty();
//     }
//   }
// }
