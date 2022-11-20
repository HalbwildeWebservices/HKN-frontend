import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICreatePhoneNumberRequest, ICreateUserRequest, IPatchPhoneNumberRequest, IPatchUserRequest, IPermissionResponse, IUser, IUserResponse } from 'hkn-common';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl = 'https://localhost:3000'
  constructor(private http: HttpClient) { }

  public getUsers() {
    return this.http.get<IUser[]>(`${this.baseUrl}/users`)
  }

  public getUser(userId: string) {
    return this.http.get<IUserResponse>(`${this.baseUrl}/users/${userId}`);
  }

  public addUser(createUserRequest: ICreateUserRequest) {
    return this.http.post<IUserResponse>(`${this.baseUrl}/users`, createUserRequest);
  }

  public deleteUser(userId: string) {
    return this.http.delete<IUserResponse[]>(`${this.baseUrl}/users/${userId}`)
  }

  public updateUser(userId: string, patchUserRequest: IPatchUserRequest) {
    return this.http.patch<IUserResponse>(`${this.baseUrl}/users/${userId}`, patchUserRequest)
  }

  public deletePhoneNumber(userId: string, phoneId: string) {
    return this.http.delete<IUserResponse>(`${this.baseUrl}/users/${userId}/phone-numbers/${phoneId}`);
  }

  public updatePhoneNumber(userId: string, request: IPatchPhoneNumberRequest) {
    return this.http.patch<IUserResponse>(`${this.baseUrl}/users/${userId}/phone-numbers/${request.phoneId}`, request);
  }

  public addPhoneNumber(userId: string, request: ICreatePhoneNumberRequest) {
    console.log('add phone number request', userId, request);
    return this.http.post<IUserResponse>(`${this.baseUrl}/users/${userId}/phone-numbers`, request);
  }

  public getUserPermissions(userId: string) {
    return this.http.get<IPermissionResponse>(`${this.baseUrl}/users/${userId}/permissions`);
  }

  public setUserPermissions(userId: string, permissions: string[]) {
    return this.http.put<IUserResponse>(`${this.baseUrl}/users/${userId}/permissions`, { permissions })
  }


}
