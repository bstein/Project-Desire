import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // Keep track of the current route (update variable whenever new navigation starts)
  currentRoute = window.location.pathname;
  
  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationStart) {
          this.currentRoute = event.url;
          this.setLinkActive(this.currentRoute);
        }
    });
  }

  ngOnInit() {
  }

  // Store states of each link
  shipActive = false;
  historyActive = false;
  accountActive = false;

  hoverActivated(event) {
    this.setLinkActive((event.target as HTMLElement).getAttribute('routerLink'));
  }

  hoverDeactivated() {
    this.setLinkActive(this.currentRoute);
  }

  setLinkActive(route) {
    // Show 'route' link as active
    if (route.substring(0, '/history'.length) === '/history') {
      this.shipActive = false;
      this.historyActive = true;
      this.accountActive = false;
    } else if (route.substring(0, '/account'.length) === '/account') {
      this.shipActive = false;
      this.historyActive = false;
      this.accountActive = true;
    } else { // this block should run for routes '/' and '/ship'
      this.shipActive = true;
      this.historyActive = false;
      this.accountActive = false;
    }
  }
}
