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

  disableAddressFields = false;

  addressLine1 = '';
  addressLine2 = '';
  city = '';
  state = '';
  zipCode = '';

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

        this.showLocations();
      }).catch(err => {
        // TODO handle other / error
      });
    } else {
      this.showLocations();
    }
  }

  private showLocations() {
    // Add option of manual entry, set selected to be the default location OR the manual entry
    this.locations.push({ addressName: '+ New Address' });
    this.selectedLocation = this.locations[0];

    // Disable location selection if there is only manual entry available
    //  If there are saved options, update the form with the saved address (disable edits, too)
    const disable = (this.locations.length === 1);
    this.disableLocationSelect = disable;
    this.disableAddressFields = !disable;
    if (!disable) {
      this.updateAddressFields(this.selectedLocation);
    }

    this.gotLocations = true;
  }

  private locationChanged(event: MatSelectChange) {
    // Pass saved address if selected, or pass empty if manual entry selected
    //  Disable edits if a saved address was selected
    this.updateAddressFields(event.value['_id'] ? event.value : {});
    this.disableAddressFields = (event.value['_id'] !== undefined);
  }

  private updateAddressFields(adr) {
    // Set the address form fields
    //  The ternary operators ensure no value is 'undefined' in case of missing attribute from adr
    this.addressLine1 = adr['street1'] ? adr['street1'] : '';
    this.addressLine2 = adr['street2'] ? adr['street2'] : '';
    this.city = adr['city'] ? adr['city'] : '';
    this.state = adr['state'] ? adr['state'] : '';
    this.zipCode = adr['zip'] ? adr['zip'] : '';
  }

}
