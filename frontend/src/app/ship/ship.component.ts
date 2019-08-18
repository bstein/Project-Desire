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
      throw new Error(res.status.toString());
    }).then((data) => { 
      this.users = data;
      this.gotUsers = true;
    }).catch(status => {
      if (status === 401 || status === 403) {
        this.redirect.to('/account/login');
      }
      // TODO handle other status code / error
    });
  }

  ngOnInit() {
  }

}
