import { Component} from '@angular/core';
import { AccountService } from '@app/_services';

@Component({
    templateUrl: 'layout.component.html',
    styleUrls: ['../../assets/scss/generales/app.scss']
})
export class LayoutGeneralesComponent {

    constructor(private accountService: AccountService) { }

    logout() { this.accountService.logout(); }
}
