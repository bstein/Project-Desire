import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Name {
  name: string;
  pictureURL: string;
}

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit {
  nameCtrl = new FormControl();
  filteredNames: Observable<Name[]>;

  names: Name[] = [
    {
      name: 'Alice',
      pictureURL: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
    },
    {
      name: 'Amy',
      pictureURL: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
    },
    {
      name: 'Alex',
      pictureURL: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
    },
    {
      name: 'Adam',
      pictureURL: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg'
    }
  ];

  constructor() {
    this.filteredNames = this.nameCtrl.valueChanges
      .pipe(
        startWith(''),
        map(name => name ? this._filterNames(name) : this.names.slice())
      );
  }

  ngOnInit() {
  }

  private _filterNames(value: string): Name[] {
    const filterValue = value.toLowerCase();

    return this.names.filter(name => name.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
