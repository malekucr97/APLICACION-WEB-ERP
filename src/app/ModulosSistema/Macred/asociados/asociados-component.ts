import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { User, Module } from '@app/_models';
import { first } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '../../../_models/modules/compania';
import { Grupo } from '@app/_models/Cumplimiento/Grupo';
import { MacredService } from '@app/_services/macred.service';
import { httpModulesPages } from '@environments/environment-access-admin';

declare var $: any;

@Component({
    templateUrl: 'HTML_Asociados.html',
    styleUrls: ['../../../../../assets/scss/macred/app.scss'],
})
export class AsociadosComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;
    
    userObservable: User;
    moduleObservable: Module;
    companiaObservable: Compania;

    showList : boolean = false;
    submitted : boolean = false;
    update : boolean = false;
    add : boolean = false;
    delete : boolean = false;

    buttomText : string = '';

    listGroups: Grupo[];
    listGroupsSubject : Grupo[];

    public URLAddEditGroupPage: string = httpModulesPages.urlCumplimiento_Grupo;

    constructor (private formBuilder: FormBuilder,
                 private macredService: MacredService, 
                 private accountService: AccountService,
                 private alertService: AlertService)
    {
        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.companiaObservable = this.accountService.businessValue;
    }

    ngOnInit() {

        // this.macredService.getGroupsBusiness(this.userObservable.empresa)
        // .pipe(first())
        // .subscribe(groupsResponse => {

        //     if (groupsResponse.length > 0) {
        //         this.showList = true;
        //         this.listGroups = groupsResponse;
        //     }
        // },
        // error => {
        //     let message : string = 'Problemas al consultar los grupos de riesgo. ' + error;
        //     this.alertService.error(message); 
        // });
    }
}