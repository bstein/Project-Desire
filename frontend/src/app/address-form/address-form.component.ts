import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatSelectChange } from '@angular/material';

import { RedirectService, AuthService } from '../global.service';
import { iso3166Countries } from  '../constants';

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
  postalCode = '';

  countries = iso3166Countries;
  countryCtrl = new FormControl();
  filteredCountries: Observable<Object[]>;

  constructor(private auth: AuthService, private redirect: RedirectService) {
    this.filteredUsers = this.nameCtrl.valueChanges
      .pipe(
        startWith(''),
        map((value) => {
          if (!value) {
            return '';
          } else if (typeof value === 'string') {
            return value;
          }

          return value.name;
        }),
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

    // Allow the user to enter & select a name that does not match an existing user
    matchingUserNames.push({
      name: value,
      pictureURL: 'assets/icons/baseline-face-24px.svg'
    });

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

    // Enable location select, disable address fields, and disable country field if there are saved addresses
    //  Or, do the opposite if there are no saved addresses
    const hasSavedAdrs = (this.locations.length > 1);
    this.disableLocationSelect = !hasSavedAdrs;
    this.disableAddressFields = hasSavedAdrs;
    hasSavedAdrs ? this.countryCtrl.disable() : this.countryCtrl.enable();

    this.updateAddressFields(this.selectedLocation);
    this.gotLocations = true;
  }

  private locationChanged(event: MatSelectChange) {
    // Update address fields & enable edits if saved address selected
    //  Or, empty address fields & disable edits if manual entry selected
    const savedAdrSelected = (event.value['_id'] !== undefined);
    this.disableAddressFields = savedAdrSelected;
    savedAdrSelected ? this.countryCtrl.disable() : this.countryCtrl.enable();
    this.updateAddressFields(savedAdrSelected ? event.value : {});
  }

  private updateAddressFields(adr) {
    // Set the address form fields
    //  The ternary operators ensure no value is 'undefined' in case of missing attribute from adr
    this.addressLine1 = adr['street1'] ? adr['street1'] : '';
    this.addressLine2 = adr['street2'] ? adr['street2'] : '';
    this.city = adr['city'] ? adr['city'] : '';
    this.state = adr['state'] ? adr['state'] : '';
    this.postalCode = adr['zip'] ? adr['zip'] : '';

    // Call reset() on FormControl and update the filtered countries array with a fresh mapping
    this.resetCountryField();

    // If adr['country'] exists and it matches an ISO, set the corresponding country object
    //  Or set it to undefined (to indicate no selection)
    const countryObj = adr['country'] ? this.countries.find(c => c.iso3166 === adr['country']) : undefined;
    this.countryCtrl.setValue(countryObj);
  }

  private resetCountryField() {
    this.countryCtrl.reset();

    this.filteredCountries = this.countryCtrl.valueChanges
      .pipe(
        startWith(''),
        map((value) => {
          if (!value) {
            return '';
          } else if (typeof value === 'string') {
            return value;
          } else if (value.name) {
            return value.name;
          }
        }),
        map(name => name ? this._filterCountries(name) : this.countries.slice())
      );
  }

  private _filterCountries(value: string): Object[] {
    const filterValue = value.toLowerCase();
    const matchingCountries = this.countries.filter(country => country['name'].toLowerCase().indexOf(filterValue) === 0);

    return matchingCountries;
  }

  // When a country is selected, show its name
  private displayCountry(country?: Object): string | undefined {
    return country ? country['name'] : undefined;
  }

}
