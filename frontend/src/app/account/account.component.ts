import { Component, OnInit } from '@angular/core';
import { RedirectService, AuthService } from '../global.service';

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

  loggedIn = false;

  constructor(private auth: AuthService, private redirect: RedirectService) {
    this.auth.isLoggedIn(() => { this.redirect.to('/account/login') }).then((val) => { this.loggedIn = val; });

    // Add Google API Meta Tags to HTML
    this.docAddMeta('google-signin-scope', 'profile email');
    this.docAddMeta('google-signin-client_id', `${window['__env']['GOOGLE_CLIENT_ID']}.apps.googleusercontent.com`);

    // Add Google API Platform script to HTML
    this.docAddScript('https://apis.google.com/js/platform.js?onload=init', true, true, 'utf-8');


  }

  ngOnInit() {
  }

  signOut() {
    
  }

}
