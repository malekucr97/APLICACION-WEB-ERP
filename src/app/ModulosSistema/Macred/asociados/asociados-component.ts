import { FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { User, Module } from '@app/_models';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '../../../_models/modules/compania';
import { MacredService } from '@app/_services/macred.service';
import { ScreenAccessUser } from '@app/_models/admin/screenAccessUser';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

declare var $: any;

@Component({
    templateUrl: 'HTML_Asociados.html',
    styleUrls: ['../../../../assets/scss/macred/app.scss'],
})
export class AsociadosComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    nombrePantalla : string = 'CalificacionAsociados.html';
    
    userObservable: User;
    moduleObservable: Module;
    companiaObservable: Compania;

    listScreenAccessUser: ScreenAccessUser[];

    constructor (private formBuilder: FormBuilder,
                 private macredService: MacredService,
                 private accountService: AccountService,
                 private alertService: AlertService,
                 private router: Router)
    {
        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.companiaObservable = this.accountService.businessValue;
    }

    ngOnInit() {
        this.accountService.validateAccessUser( this.userObservable.id, 
                                                this.moduleObservable.id, 
                                                this.nombrePantalla, 
                                                this.companiaObservable.id )
            .pipe(first())
            .subscribe(response => {
                if(!response.exito)
                    this.router.navigate([this.moduleObservable.indexHTTP]);
            });
    }

    
}