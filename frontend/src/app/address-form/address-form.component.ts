import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

//import { User } from '../objects';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit {
  @Input()
  users: Object[];
  nameCtrl = new FormControl();
  filteredUsers: Observable<Object[]>;

  constructor() {
    this.filteredUsers = this.nameCtrl.valueChanges
      .pipe(
        startWith(''),
        map(user => user ? this._filterUsers(user) : this.users.slice())
      );
  }

  ngOnInit() {
  }

  private _filterUsers(value: string): Object[] {
    const filterValue = value.toLowerCase();

    return this.users.filter(user => user["name"].toLowerCase().indexOf(filterValue) === 0);
  }

}
