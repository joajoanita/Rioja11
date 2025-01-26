import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs'; 
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})

export class AuthStateService {
  private userState: BehaviorSubject<boolean>;
  userAuthState: Observable<boolean>;

  constructor(public token: TokenService) {
    this.userState = new BehaviorSubject<boolean>(this.token.isLoggedIn()!);
    this.userAuthState = this.userState.asObservable();
  }

  setAuthState(value: boolean) {
    this.userState.next(value);
  }
}