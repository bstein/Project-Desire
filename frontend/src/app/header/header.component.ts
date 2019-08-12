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
    switch (route) {
      case '/':
      case '/ship':
        this.shipActive = true;
        break;
      case '/history':
        this.historyActive = true;
        break;
      case '/account':
        this.accountActive = true;
        break;
      default:
        break;
    }
  }
}
