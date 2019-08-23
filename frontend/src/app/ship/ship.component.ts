import { Component, OnInit } from '@angular/core';
import { RedirectService, AuthService } from '../global.service';

@Component({
  selector: 'app-ship',
  templateUrl: './ship.component.html',
  styleUrls: ['./ship.component.css']
})
export class ShipComponent implements OnInit {

  loggedIn = false;
  gotUsers = false;
  users = [];

  constructor(private auth: AuthService, private redirect: RedirectService) {
    this.auth.isLoggedIn(() => { this.redirect.to('/account/login') }).then((val) => { this.loggedIn = val; });

    fetch('/api/users', {
      method: 'GET',
      credentials: 'include',
    }).then((res) => {
      if (res.ok) { return res.json(); }
      else if (res.status === 401 || res.status === 403) {
        this.auth.loginUpdate(false);
        this.redirect.to('/account/login');
      }
      throw new Error(res.status.toString());
    }).then((data) => {
      this.users = data;
      this.gotUsers = true;
    }).catch(err => {
      // TODO handle other status code / error
    });
  }

  ngOnInit() {
  }

}
