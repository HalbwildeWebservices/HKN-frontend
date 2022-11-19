import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserIdTransferService {

  public userId: BehaviorSubject<string | undefined>

  constructor() { 
    this.userId = new BehaviorSubject<string|undefined>(undefined);
  }

  setUserId(userId: string | undefined) {
    this.userId.next(userId);
  }  

}
