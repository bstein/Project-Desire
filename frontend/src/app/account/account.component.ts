import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
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

  constructor() {
    // Add Google API Meta Tags to HTML
    this.docAddMeta('google-signin-scope', 'profile email');
    this.docAddMeta('google-signin-client_id', `${window['__env']['GOOGLE_CLIENT_ID']}.apps.googleusercontent.com`);

    // NOTE: Use redirect here instead of popup to workaround issues with CSP (GitHub Issue #1)
    this.docAddMeta('google-signin-ux_mode', 'redirect');

    // Add Google API Platform script to HTML
    this.docAddScript('https://apis.google.com/js/platform.js?onload=init', true, true, 'utf-8');

    //window['onSignIn'] = this.onSignIn;
  }

  ngOnInit() {
  }

  onSignIn(googleUser) {
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
  }

}
