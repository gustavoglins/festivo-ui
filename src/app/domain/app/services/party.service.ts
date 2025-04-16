import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { PartyDetailsResponse, NewPartyRequest } from '../interfaces/party.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartyService {
  private readonly API_URL = 'http://localhost:8080/api/party';

  constructor(private http: HttpClient) { }

  createParty(newEventRequest: NewPartyRequest): Observable<PartyDetailsResponse> {
    return this.http.post<PartyDetailsResponse>(this.API_URL, newEventRequest);
  }

  getPartyDetails(id: string): Observable<PartyDetailsResponse> {
    return this.http.get<PartyDetailsResponse>(`${this.API_URL}/${id}`);
  }

  getUserParties(): Observable<PartyDetailsResponse[]> {
    return this.http.get<PartyDetailsResponse[]>(this.API_URL);
  }
}
