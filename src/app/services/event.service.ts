import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EVENT_API_URL } from '../app-injection-tokens';
import { ApiEvent } from '../models/ApiEvent';
import { Coordinates } from '../models/Coordinates';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private datePipe: DatePipe, 
    private http: HttpClient, 
    @Inject(EVENT_API_URL) private apiUrl: string) { }

  private baseApiUrl = `${this.apiUrl}api/`;

  public getEvent(id: number): Observable<ApiEvent>{
    return this.http.get<ApiEvent>(`${this.baseApiUrl}events/${id}`);
  }

  public getEvents(): Observable<ApiEvent[]>{
    return this.http.get<ApiEvent[]>(`${this.baseApiUrl}events`)
  }

  public getUserEvents(id: string): Observable<number[]>{
    return this.http.get<number[]>(`${this.baseApiUrl}eventUsers/get_user_events/${id}`)
  }

  public setEventToUser(eventId: number, userId: string): any{
    return this.http.post(`${this.baseApiUrl}eventUsers/${eventId}/${userId}`,{});
  }

  public createEvent(name: string, description: string, photos: any, price: number, numbers: string[] ,coordinates: Coordinates, _eventDate: Date, owner: string): any{
    let eventDate = this.datePipe.transform(_eventDate, 'yyyy-MM-dd');

    return this.http.post<ApiEvent>(`${this.baseApiUrl}events`,{
      name, description, photos, price, numbers, coordinates, eventDate, owner
    });
  }

  public updateEvent(id: number, name: string, description: string, photos: any, price: number, numbers: string[] ,coordinates: Coordinates, _eventDate: Date, isApproved: boolean): any{
    let eventDate = this.datePipe.transform(_eventDate, 'yyyy-MM-dd');

    return this.http.put(`${this.baseApiUrl}events/${id}`, {
      id, name, description, photos, price, numbers, coordinates, eventDate, isApproved
    });
  }

  public deleteEvent(id: number): any{
    return this.http.delete(`${this.baseApiUrl}events/${id}`)
  }

  public deleteEventWhereOwner(id: string): any{
    return this.http.delete(`${this.baseApiUrl}events/delete_where_owner/${id}`)
  }
}
