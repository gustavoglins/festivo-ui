import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { UserService } from '../../app/services/user.service';
import {
  AuthResponse,
  UserLoginRequest,
  UserSignupRequest,
} from '../interfaces/user.interface';
import { LocalStorageService } from './../../../core/services/local-storage.service';
import { UserRecoverPasswordRequest } from './../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) {}

  signup(userSignupRequest: UserSignupRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.API_URL + '/signup', userSignupRequest)
      .pipe(
        tap((response: AuthResponse) => {
          this.localStorageService.setItem('authToken', response.token);
          this.userService.setUsername(response.name);
        })
      );
  }

  login(userLoginRequest: UserLoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.API_URL + '/login', userLoginRequest)
      .pipe(
        tap((response: AuthResponse) => {
          this.localStorageService.setItem('authToken', response.token);
          this.userService.setUsername(response.name);
        })
      );
  }

  logout() {
    this.localStorageService.removeItem('authToken');
    this.userService.setUsername(null);
    window.location.reload();
  }

  isAuthenticated(): boolean {
    const token = this.localStorageService.getItem('authToken');
    if (!token) return false;

    try {
      const decodeToken: any = jwtDecode(token.toString());
      const currentTime = Math.floor(Date.now() / 1000);
      return decodeToken.exp > currentTime;
    } catch (error) {
      console.error('Error decoding token', error);
      return false;
    }
  }

  //TODO
  recoverPassword(userRecoverPasswordRequest: UserRecoverPasswordRequest) {
    return this.http.post(
      this.API_URL + '/password',
      userRecoverPasswordRequest
    );
  }
}
