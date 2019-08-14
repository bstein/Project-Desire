import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-login-verify',
  templateUrl: './account-login-verify.component.html',
  styleUrls: ['./account-login-verify.component.css']
})
export class AccountLoginVerifyComponent implements OnInit {

  constructor(private router: Router, private ngZone: NgZone) {
    // At the time of writing, Google was passing the id_token after #
    let params = this.getURIParams(window.location.hash);

    if (!this.verifyToken(params)) {
      // Second attempt: try with normal method, as Google may have normalized the format
      params = this.getURIParams(window.location.search);

      if (!this.verifyToken(params)) {
        console.log('DEBUG: second attempt failed');
        this.redirectTo('/account/login');
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
      console.log("DEBUG: no id_token!");
      return false;
    }

    console.log('DEBUG: verifying token...');
    fetch('/api/verify-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `${encodeURIComponent('idtoken')}=${encodeURIComponent(params['id_token'])}`,
    }).then((res) => {
      if (res.status === 200 || res.status === 201) { // TODO - delegate 201 / new user to separate block
        console.log("DEBUG: successful authentication!");
        this.redirectTo('/ship');
      // } else if (res.status === 201) {
      //  // TODO - new user
      //  this.redirectTo('/account/setup');
      } else {
        console.log("DEBUG: failed authentication!");
        // this.redirectTo('/account/login');
      }
    });

    return true;
  }

  redirectTo(uri) {
    this.ngZone.run(() => this.router.navigate([uri]));
  }
}
