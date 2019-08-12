import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // Keep track of the current route (update variable whenever new navigation starts)
  currentRoute = '/ship';
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
    this.resetAllLinks();
    this.setLinkActive((event.target as HTMLElement).getAttribute('routerLink'));
  }

  hoverDeactivated(event) {
    this.resetAllLinks();
    this.setLinkActive(this.currentRoute);
  }

  resetAllLinks() {
    // Reset all links to appear inactive
    this.shipActive = false;
    this.historyActive = false;
    this.accountActive = false;
  }

  setLinkActive(route) {
    // Show 'route' link as active
    if (route.substring(0, '/history'.length) === '/history') {
      this.historyActive = true;
    } else if (route.substring(0, '/account'.length) === '/account') {
      this.accountActive = true;
    } else { // this block should run for routes '/' and '/ship'
      this.shipActive = true;
    }
  }
}
