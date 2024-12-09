import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}
  private readonly _http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  public getUsers(): Observable<User[]> {
    return this._http.get<User[]>(this.apiUrl);
  }

  public getUsersByName(name: string): Observable<User[]> {
    return this._http.get<User[]>(`${this.apiUrl}?name=${name}`);
  }
}
