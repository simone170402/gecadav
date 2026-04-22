import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SubscribeRequest, SubscriptionPlan, UserSubscription } from './subscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.apiUrl}/subscription-plans`);
  }

  subscribe(payload: SubscribeRequest): Observable<UserSubscription> {
    return this.http.post<UserSubscription>(`${this.apiUrl}/subscriptions`, payload);
  }

  hasSubscription(userEmail: string): Observable<boolean> {
    const params = new HttpParams().set('userEmail', userEmail);
    return this.http.get<boolean>(`${this.apiUrl}/subscriptions/check`, { params });
  }
}