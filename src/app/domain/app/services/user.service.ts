import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserUpdateRequest } from '../interfaces/user.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './../../../core/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  getUser(): Observable<User> {
    return this.http.get<User>(this.API_URL);
  }

  setUsername(username: string | null): void {
    this.localStorageService.setItem('username', username);
  }

  getUsername(): string | null {
    return this.localStorageService.getItem('username');
  }

  uploadProfilePicture(profilePicture: any): Observable<any> {
    return this.http.post(this.API_URL + '/profile-photo', profilePicture);
  }

  loadProfilePicture(): Observable<any> {
    return this.http.get(this.API_URL + '/profile-photo', {
      responseType: 'blob',
    });
  }

  update(userUpdateRequest: UserUpdateRequest): Observable<User> {
    return this.http.put<User>(this.API_URL, userUpdateRequest);
  }
}
