import { Component, OnInit } from '@angular/core';
import { RedirectService, AuthService } from '../global.service';

@Component({
  selector: 'app-ship',
  templateUrl: './ship.component.html',
  styleUrls: ['./ship.component.css']
})
export class ShipComponent implements OnInit {

  loggedIn = false;

  constructor(private auth: AuthService, private redirect: RedirectService) {
    this.auth.isLoggedIn(() => { this.redirect.to('/account/login') }).then((val) => { this.loggedIn = val; });
  }

  ngOnInit() {
  }

}
