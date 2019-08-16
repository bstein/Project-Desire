import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  constructor(private router: Router, private ngZone: NgZone) { }

  to(uri) {
    this.ngZone.run(() => this.router.navigate([uri]));
  }

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private knownStatus = new BehaviorSubject<boolean>(false);
  private loggedIn = new BehaviorSubject<boolean>(false);
  
  // NOTE - loggedIn will stay true even when the session cookie expires (e.g., the browser has been open for some time)
  //          or if the user was deleted in the database on the backend, HOWEVER, this is not a security risk since
  //          the backend checks before revealing any priveleged information. The The "worst case scenario" here is
  //          receiving a 403 from the backend. If that happens, the '/api/status' call can be made again to
  //          confirm the login status has indded changed to false.

  constructor() { }

  async isLoggedIn(redirect = () => {}) {
    // If the status is unknown, check it now
    if (!this.knownStatus.value) {
      await this.getStatus();
    }

    if (!this.loggedIn.value) {
      redirect();
    }

    return this.loggedIn.value;
  }

  private async getStatus() {
    const res = await fetch('/api/status', {
      method: 'GET',
      credentials: 'include',
    });

    this.loginUpdate(res.status === 200);
  }

  loginUpdate(val) {
    this.knownStatus.next(true);
    this.loggedIn.next(val);
  }

}