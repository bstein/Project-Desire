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
    if (event.option.value['_id']) {
      // Existing user was selected, get a list of their public addresses
      fetch(`/api/addresses?owner=${encodeURIComponent(event.option.value['_id'])}`, {
        method: 'GET',
        credentials: 'include',
      }).then((res) => {
        if (res.ok) { return res.json(); }
        throw new Error(res.status.toString());
      }).then((data) => {
        // TODO - Add new address entry option
        this.addresses = data; //.push({ addressName: '+ Enter Address Manually'});
        this.gotAddresses = true;
      }).catch(status => {
        if (status === 401 || status === 403) {
          this.auth.loginUpdate(false);
          this.redirect.to('/account/login');
        }
        // TODO handle other status code / error
      });
    } else {
      // New name entered, skip to showing full address form
      console.log('new name entered!');
    }
  }

}
