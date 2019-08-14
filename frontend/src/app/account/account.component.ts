import { Component, OnInit } from '@angular/core';
import { RedirectService, AuthService } from '../global.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  loggedIn = false;

  constructor(private auth: AuthService, private redirect: RedirectService) {
    this.auth.isLoggedIn(() => { this.redirect.to('/account/login') }).then((val) => { this.loggedIn = val; });
  }

  ngOnInit() {
  }

}
