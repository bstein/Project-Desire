import { Component, OnInit } from '@angular/core';
import { RedirectService, AuthService } from '../global.service';

@Component({
  selector: 'app-account-login-verify',
  templateUrl: './account-login-verify.component.html',
  styleUrls: ['./account-login-verify.component.css']
})
export class AccountLoginVerifyComponent implements OnInit {

  constructor(private redirect: RedirectService, private auth: AuthService) {
    // At the time of writing, Google was passing the id_token after #
    let params = this.getURIParams(window.location.hash);

    if (!this.verifyToken(params)) {
      // Second attempt: try with normal method, as Google may have normalized the format
      params = this.getURIParams(window.location.search);

      if (!this.verifyToken(params)) {
        this.redirect.to('/account/login');
      }
    }
  }

  ngOnInit() {
  }

  getURIParams(uri) {
    return uri
      ? (/^[?#]/.test(uri) ? uri.slice(1) : uri)
          .split('&')
          .reduce((params, param) => {
            const [key, value] = param.split('=');
            params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
            return params;
          }, {}
          )
      : {}
  }

  verifyToken(params) {
    if (!('id_token' in params)) {
      return false;
    }

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `${encodeURIComponent('idtoken')}=${encodeURIComponent(params['id_token'])}`,
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

    return true;
  }

}
