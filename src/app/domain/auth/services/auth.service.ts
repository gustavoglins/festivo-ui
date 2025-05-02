import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SessionStorageService } from '../../../core/services/session-storage.service';
import { UserService } from '../../app/services/user.service';
import {
  AuthResponse,
  UserForgotPasswordRequest,
  UserLoginRequest,
  UserResetPasswordRequest,
  UserSignupRequest,
} from '../interfaces/user.interface';
import { LocalStorageService } from './../../../core/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private userService: UserService
  ) {}

  signup(userSignupRequest: UserSignupRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.API_URL + '/signup', userSignupRequest)
      .pipe(
        tap((response: AuthResponse) => {
          this.sessionStorageService.setItem('authToken', response.token);
          this.userService.setUsername(response.name);
        })
      );
  }

  login(
    userLoginRequest: UserLoginRequest,
    keepLogged: boolean
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.API_URL + '/login', userLoginRequest)
      .pipe(
        tap((response: AuthResponse) => {
          if (keepLogged) {
            this.localStorageService.setItem('authToken', response.token);
            this.userService.setUsername(response.name);
          } else {
            this.sessionStorageService.setItem('authToken', response.token);
            this.userService.setUsername(response.name);
          }
        })
      );
  }

  logout() {
    this.localStorageService.removeItem('authToken');
    this.sessionStorageService.removeItem('authToken');
    this.userService.setUsername(null);
    window.location.reload();
  }

  isAuthenticated(): boolean {
    const localToken = this.localStorageService.getItem('authToken');
    const sessionToken = this.sessionStorageService.getItem('authToken');
    if (localToken || sessionToken) return true;
    else return false;
  }

  forgotPassword(userForgotPasswordRequest: UserForgotPasswordRequest) {
    return this.http.post(
      this.API_URL + '/forgot-password',
      userForgotPasswordRequest
    );
  }

  resetPassword(userResetPasswordRequest: UserResetPasswordRequest) {
    return this.http.post(
      this.API_URL + '/reset-password',
      userResetPasswordRequest
    );
  }
}
