import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  docAddMeta(name, content) {
    const meta = document.createElement('meta');
    meta.name = name;
    meta.content = content;
    document.getElementsByTagName('head')[0].appendChild(meta);
  }

  // Add Content Security Policy with nonce to HTML head
  // docAddCSP(nonce) {
  //   const meta = document.createElement('meta');
  //   meta.setAttribute('http-equiv', 'Content-Security-Policy');
  //   meta.content = `script-src 'unsafe-inline' https: 'nonce-${nonce}' 'strict-dynamic'`;
  //   document.getElementsByTagName('head')[0].appendChild(meta);
  // }

  docAddScript(src, async, defer, charset) {
    const script = document.createElement('script');
    // script.nonce = `nonce-${nonce}`;
    script.src = src;
    script.type = 'text/javascript';
    script.charset = charset;
    if (async) { script.setAttribute('async', ''); }
    if (defer) { script.setAttribute('defer', ''); }
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  constructor() {
    // Add Google API Meta Tags to HTML
    this.docAddMeta('google-signin-scope', 'profile email');
    this.docAddMeta('google-signin-client_id', `${window['__env']['GOOGLE_CLIENT_ID']}.apps.googleusercontent.com`);
    this.docAddMeta('google-signin-ux_mode', 'redirect'); // TODO - replace with default popup ux_mode?

    // Sample, static nonce - TODO: replace with dynamic nonce
    // Not in use currently as it doesn't seem to have any effect
    // const nonce = '';
    // this.docAddCSP(nonce);

    // Add Google API Platform script to HTML (note: nonce could be added here)
    this.docAddScript('https://apis.google.com/js/platform.js?onload=init', true, true, 'utf-8');

    window['onSignIn'] = function (googleUser) {
      const id_token = googleUser.getAuthResponse().id_token;

      console.log('verifying token...');
      fetch('/api/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `${encodeURIComponent('idtoken')}=${encodeURIComponent(id_token)}`,
      }).then((res) => {
        if (res.status === 200 || res.status === 201) { // TODO - delegate 201 / new user to separate block
          console.log("successful authentication!");
          //location.replace('/');
        // } else if (res.status === 201) {
        //  // TODO - new user
        //  location.replace('/account');
        } else {
          console.log("failed authentication!");
          //location.reload(true);
        }
      });
    };
  }

  ngOnInit() {
  }

}
