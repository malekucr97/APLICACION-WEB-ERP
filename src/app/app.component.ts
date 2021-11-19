import { Component } from '@angular/core';
import { AccountService } from './_services';

import { User } from './_models';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'app',
    templateUrl: 'app.component.html'
    , styleUrls: ['../assets/scss/app.scss']
})
export class AppComponent {
    user: User;

    constructor(private accountService: AccountService) {

        this.accountService.user.subscribe(x => this.user = x);
    }
}
