import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  greeting = "I'm not sure who you are! :(";

  constructor() { }

  ngOnInit() {
  }

}
