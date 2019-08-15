import { Component, OnInit } from '@angular/core';

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

  constructor() {
    // // Add Google API Meta Tags to HTML
    // this.docAddMeta('google-signin-scope', 'profile email');
    // this.docAddMeta('google-signin-client_id', `${window['__env']['GOOGLE_CLIENT_ID']}.apps.googleusercontent.com`);

    // // NOTE: Use redirect here instead of popup to workaround issues with CSP (GitHub Issue #1)
    // this.docAddMeta('google-signin-ux_mode', 'redirect');
    // this.docAddMeta('google-signin-redirect_uri', `${window.location.origin}/account/login/verify`);

    // // Add Google API Platform script to HTML
    // this.docAddScript('https://apis.google.com/js/platform.js?onload=init', true, true, 'utf-8');
  }

  ngOnInit() {
  }

}
