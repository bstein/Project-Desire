import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  docAddMetaTag(name, content) {
    const node = document.createElement('meta');
    node.name = name;
    node.content = content;
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  docAddScript(src, async, defer, charset) {
    const node = document.createElement('script');
    node.src = src;
    node.type = 'text/javascript';
    node.async = async;
    node.defer = defer;
    node.charset = charset;
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  constructor() {
    // Add Google API Meta Tags to HTML
    this.docAddMetaTag('google-signin-scope', 'profile email');
    this.docAddMetaTag('google-signin-client_id', `${window['__env']['GOOGLE_CLIENT_ID']}.apps.googleusercontent.com`)

    // Add Google API Platform script to HTML
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
