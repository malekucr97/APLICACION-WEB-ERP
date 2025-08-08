import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services';
import { httpLandingIndexPage } from '@environments/environment';

@Component({templateUrl: 'layout.component.html',
            styleUrls: ['../../assets/scss/administrator/app.scss', '../../assets/scss/app.scss'],
            standalone: false
})
export class LayoutAdministratorComponent  {

    public urlIndex: string = httpLandingIndexPage.indexHTTP;

    constructor(private accountService: AccountService, private router: Router) { }

    logout() { this.accountService.logout(); }

    redirectIndex() : void { this.router.navigate([this.urlIndex]); }
}
