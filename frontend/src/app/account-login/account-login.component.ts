import { Component, OnInit } from '@angular/core';
import { RedirectService, AuthService, DocModifierService } from '../global.service';

@Component({
  selector: 'app-account-login',
  templateUrl: './account-login.component.html',
  styleUrls: ['./account-login.component.css']
})
export class AccountLoginComponent implements OnInit {

  constructor(private redirect: RedirectService, private auth: AuthService, private dmod: DocModifierService) {
    window['onSignIn'] = (googleUser) => {
      const id_token = googleUser.getAuthResponse().id_token;

      fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `${encodeURIComponent('idtoken')}=${encodeURIComponent(id_token)}`,
        credentials: 'include',
      }).then((res) => {
        if (res.status === 200 || res.status === 201) { // TODO - delegate 201 / new user to separate block
          this.auth.loginUpdate(true);
          this.redirect.to('/ship');
        // } else if (res.status === 201) {
        //  // TODO - new user
        //  this.redirect.to('/account/setup');
        } else {
          this.redirect.to('/account/login');
        }
      });
    };

    dmod.runGAPI(this.renderSignInBtn);
  }

  ngOnInit() {
  }

  renderSignInBtn() {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        'scope': 'profile email',
        'client_id': `${window['__env']['GOOGLE_CLIENT_ID']}.apps.googleusercontent.com`,
      }).then(() => {
        gapi.signin2.render('signin-google', {
          scope: 'profile email',
          width: 160,
          height: 48,
          longtitle: false,
          theme: 'dark',
          onsuccess: window['onSignIn']
        });
      });
    });
  }

}
