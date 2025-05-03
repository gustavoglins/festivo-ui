import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  NewPartyRequest,
  PartyDetailsResponse,
} from '../interfaces/party.interface';

@Injectable({
  providedIn: 'root',
})
export class PartyService {
  private readonly API_URL = 'http://localhost:8080/api/party';

  constructor(private http: HttpClient) {}

  createParty(
    newEventRequest: NewPartyRequest
  ): Observable<PartyDetailsResponse> {
    return this.http.post<PartyDetailsResponse>(this.API_URL, newEventRequest);
  }

  // createParty(partyForm: FormData): Observable<any> {
  //   return this.http.post(this.API_URL, partyForm);
  // }

  getPartyDetails(id: string): Observable<PartyDetailsResponse> {
    return this.http.get<PartyDetailsResponse>(`${this.API_URL}/${id}`);
  }

  getUserParties(): Observable<PartyDetailsResponse[]> {
    return this.http.get<PartyDetailsResponse[]>(this.API_URL);
  }
}
