import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { UserResetPasswordRequest } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
  ],
  templateUrl: './reset-password.page.html',
  styleUrl: './reset-password.page.scss',
})
export class ResetPasswordPage implements OnInit {
  resetForm!: FormGroup;
  token: string | null = null;
  success = false;
  submitted = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (!this.token) {
      this.error = 'Token is missing';
      return;
    }

    if (this.resetForm.valid) {
      this.submitted = true;

      const userResetPasswordRequest: UserResetPasswordRequest = {
        token: this.token,
        newPassword: this.resetForm.value.newPassword,
      };

      this.authService.resetPassword(userResetPasswordRequest).subscribe({
        next: () => {
          this.success = true;
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          console.log(error);
          this.error = 'Failed to reset password. Please try again.';
          this.success = false;
        },
      });
    } else {
      this.resetForm.markAllAsTouched();
      this.resetForm.markAsDirty();
    }
  }
}
