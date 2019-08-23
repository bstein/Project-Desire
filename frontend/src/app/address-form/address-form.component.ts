import { Component, OnInit, Input, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatSelectChange } from '@angular/material';

import { RedirectService, AuthService } from '../global.service';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit {
  @Input() users: Object[];
  nameCtrl = new FormControl();
  filteredUsers: Observable<Object[]>;

  gotLocations = false;
  locations: Object[];
  disableLocationSelect = false;
  selectedLocation;

  showAddressFields = false;

  constructor(private auth: AuthService, private redirect: RedirectService) {
    this.filteredUsers = this.nameCtrl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filterUsers(name) : this.users.slice())
      );
  }

  ngOnInit() {
  }

  // When a user is selected, show their name
  private displayName(user?: Object): string | undefined {
    return user ? user['name'] : undefined;
  }

  private _filterUsers(value: string): Object[] {
    const filterValue = value.toLowerCase();
    const matchingUserNames = this.users.filter(user => user['name'].toLowerCase().indexOf(filterValue) === 0);

    // Allow the user to enter & select a name without a matching user
    if (matchingUserNames.length === 0) {
      matchingUserNames.push({
        name: value,
        pictureURL: 'assets/icons/baseline-add-24px.svg'
      });
    }

    return matchingUserNames;
  }

  private nameChanged(event: MatAutocompleteSelectedEvent) {
    // Clear existing post-name selections
    this.showAddressFields = false;
    this.gotLocations = false;
    this.locations = [];
    this.selectedLocation = undefined;

    if (event.option.value['_id']) {
      // Existing user was selected, get a list of their public addresses
      fetch(`/api/addresses?scope=normal&owner=${encodeURIComponent(event.option.value['_id'])}`, {
        method: 'GET',
        credentials: 'include',
      }).then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 401 || res.status === 403) {
          this.auth.loginUpdate(false);
          this.redirect.to('/account/login');
        }
        throw new Error(res.status.toString());
      }).then((data) => {
        this.locations = data;

        if (event.option.value['defaultAddress'] && this.locations.length > 1) {
          // Loop through locations and find which to select as default
          for (let i = 0; i < this.locations.length; i++) {
            if (this.locations[i]['_id'] === event.option.value['defaultAddress']) {
              // Copy the default address, append default indicator
              const adr = this.locations[i];
              adr['addressName'] += ' (default)';

              // Move the default address to the beginning of the list & select it
              this.locations.splice(i, 1);
              this.locations.unshift(adr);
              break;
            }
          }
        }

        this.showLocations(this.locations.length === 0);
      }).catch(err => {
        // TODO handle other / error
      });
    } else {
      this.showLocations(true);
    }
  }

  private showLocations(disable) {
    // TODO - it would probably be best to just not show the locations field if there aren't any saved
    this.locations.push({ addressName: '+ New Address' });
    this.selectedLocation = this.locations[0];
    this.disableLocationSelect = disable;
    if (disable) { this.showAddressFields = true; }
    this.gotLocations = true;
  }

  private locationChanged(event: MatSelectChange) {
    // TODO - Clear existing post-location selections

    if (event.value['_id']) {
      // TODO - Existing location was selected, show that address and disable changes
    } else {
      this.showAddressFields = true;
    }
  }

}
