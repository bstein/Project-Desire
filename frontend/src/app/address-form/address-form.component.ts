import { Component, OnInit, Input, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';

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

  gotAddresses = false;
  addresses: Object[];
  disableAddressSelect = false;
  selectedAddress;

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
    this.gotAddresses = false;
    this.addresses = [];
    this.selectedAddress = undefined;

    if (event.option.value['_id']) {
      // Existing user was selected, get a list of their public addresses
      fetch(`/api/addresses?scope=normal&owner=${encodeURIComponent(event.option.value['_id'])}`, {
        method: 'GET',
        credentials: 'include',
      }).then((res) => {
        if (res.ok) { return res.json(); }
        throw new Error(res.status.toString());
      }).then((data) => {
        this.addresses = data;

        if (event.option.value['defaultAddress'] && this.addresses.length > 1) {
          // Loop through addresses and find which to select as default
          for (let i = 0; i < this.addresses.length; i++) {
            if (this.addresses[i]['_id'] === event.option.value['defaultAddress']) {
              // Copy the default address, append default indicator
              const adr = this.addresses[i];
              adr['addressName'] += ' (default)';

              // Move the default address to the beginning of the list & select it
              this.addresses.splice(i, 1);
              this.addresses.unshift(adr);
              break;
            }
          }
        }

        this.showAddresses(this.addresses.length === 0);
      }).catch(status => {
        if (status === 401 || status === 403) {
          this.auth.loginUpdate(false);
          this.redirect.to('/account/login');
        }
        // TODO handle other status code / error
      });
    } else {
      this.showAddresses(true);
    }
  }

  private showAddresses(disable) {
    this.addresses.push({ addressName: '+ New Address' });
    this.selectedAddress = this.addresses[0];
    this.disableAddressSelect = disable;
    this.gotAddresses = true;
  }

}
