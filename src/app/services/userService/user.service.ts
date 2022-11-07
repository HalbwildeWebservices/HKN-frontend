import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from 'hkn-common';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getUsers() {
    return this.http.get<IUser[]>('https://localhost:3000/users')
  }

  public addUser(user: {[key: string]: any}) {
    return this.http.post('https://localhost:3000/users', user);
  }


}
