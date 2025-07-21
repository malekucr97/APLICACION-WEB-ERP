import { Component } from '@angular/core';
import { AccountService } from './_services';
import { Location } from '@angular/common';
import { User } from './_models';

@Component({
    selector: 'app',
    templateUrl: 'app.component.html',
    styleUrls: ['../assets/scss/app.scss'],
    standalone: false
})
export class AppComponent {
  user: User;

  constructor (private accountService: AccountService, private location: Location) 
  {
    this.accountService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    window.addEventListener('popstate', () => { 
      window.history.replaceState(null, '', '/');
      this.location.forward();
    });
  }
}
