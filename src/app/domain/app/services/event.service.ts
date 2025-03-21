import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventDetailsResponse, NewEventRequest } from '../interfaces/event.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly API_URL = 'http://localhost:8080/api/event';

  constructor(private http: HttpClient) {}

  //TODO arrumar imagem event logo e banner, formato invalido
  createEvent(newEventRequest: NewEventRequest): Observable<EventDetailsResponse>{
    return this.http.post<EventDetailsResponse>(this.API_URL, newEventRequest);
  }
}
