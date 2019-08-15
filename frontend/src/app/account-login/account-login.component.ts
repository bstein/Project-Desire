import { Component, OnInit } from '@angular/core';
import { RedirectService, AuthService } from '../global.service';

@Component({
  selector: 'app-account-login',
  templateUrl: './account-login.component.html',
  styleUrls: ['./account-login.component.css']
})
export class AccountLoginComponent implements OnInit {

  docAddMeta(name, content) {
    const meta = document.createElement('meta');
    meta.setAttribute('name', name);
    meta.setAttribute('content', content);
    document.getElementsByTagName('head')[0].appendChild(meta);
  }

  docAddScript(src, async, defer, charset) {
    const script = document.createElement('script');
    script.setAttribute('src', src);
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('charset', charset);
    if (async) { script.setAttribute('async', ''); }
    if (defer) { script.setAttribute('defer', ''); }
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  constructor(private redirect: RedirectService, private auth: AuthService) {
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
  }

    // Add Google API Meta Tags to HTML
    this.docAddMeta('google-signin-scope', 'profile email');
    this.docAddMeta('google-signin-client_id', `${window['__env']['GOOGLE_CLIENT_ID']}.apps.googleusercontent.com`);

    // Add Google API Platform script to HTML
    this.docAddScript('https://apis.google.com/js/platform.js?onload=init', true, true, 'utf-8');
  }

  ngOnInit() {
  }

  // NOTE - NOT IN USE
  // Alternative approach that relies on script being loaded in index.html
  // loadGAPI() {
  //   gapi.load('auth2', function() {
  //     console.log("READY");

  //     gapi.auth2.init({
  //       'scope': 'profile email',
  //       'client_id': `${window['__env']['GOOGLE_CLIENT_ID']}.apps.googleusercontent.com`,
  //     }).then(() => { 
  //       console.log("INIT");

  //       // const auth = gapi.auth2.getAuthInstance();
  //       gapi.signin2.render('signin-google', {
  //         scope: 'profile email',
  //         width: 160,
  //         height: 48,
  //         longtitle: false,
  //         theme: 'dark',
  //         onsuccess: (googleUser) => {
  //                       const id_token = googleUser.getAuthResponse().id_token;
  //                       console.log(`SIGN IN SUCCESS - ID TOKEN: ${id_token}`);
  //                     },
  //         onfailure: () => {
  //                       console.log('SIGN IN FAILURE');
  //                     }
  //       });
  //     });
  //   });
  // }

}
