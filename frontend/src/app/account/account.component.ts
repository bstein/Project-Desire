import { Component, OnInit } from '@angular/core';
import { RedirectService, AuthService, DocModifierService } from '../global.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  loggedIn = false;

  constructor(private auth: AuthService, private redirect: RedirectService, private dmod: DocModifierService) {
    this.auth.isLoggedIn(() => { this.redirect.to('/account/login') }).then((val) => { this.loggedIn = val; });

    dmod.runGAPI(this.initAuth2);
  }

  ngOnInit() {
  }

  initAuth2() {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        'client_id': `${window['__env']['GOOGLE_CLIENT_ID']}.apps.googleusercontent.com`,
      });
    });
  }

  signOut() {
    fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => {
      // Tell client-side gapi to sign out
      const auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(() => {
        // Update auth service and redirect to login page
        this.auth.loginUpdate(false);
        this.redirect.to('/account/login');
      })
    });
  }

}
