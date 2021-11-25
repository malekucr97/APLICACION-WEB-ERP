import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User, Module, Business } from '@app/_models';

@Component({ templateUrl: 'HTML_ListModulePage.html' })
export class ListModuleComponent implements OnInit {
    user: User;
    moduleList: Module;
    businessMod: Business;

    listModules: Module[] = [];
    listBusiness: Business[] = [];
    listAllModules: Module[] = [];

    isActivating: boolean;
    isDeleting: boolean;
    adminBoss: boolean;
    adminBusiness: boolean;

    URLAddEditUsertPage: string;
    URLAddBusinessUsertPage: string;
    URLAddRoleUsertPage: string;
    idBusiness: string;
    pidBusiness: string;

    constructor(private accountService: AccountService,
                private route: ActivatedRoute,
                private router: Router,
                private alertService: AlertService) { this.user = this.accountService.userValue; }

    ngOnInit() {

        this.isActivating   = false;
        this.isDeleting     = false;

        this.alertService.clear();

        if (this.route.snapshot.params.pidBusiness) {

            this.businessMod = new Business();

            this.pidBusiness = this.route.snapshot.params.pidBusiness;

            this.accountService.getBusinessById(this.pidBusiness)
            .pipe(first())
            .subscribe(businessResponse => {

                this.businessMod = businessResponse;

                this.accountService.getModulesBusiness(this.businessMod.id)
                    .pipe(first())
                    .subscribe(modulesBResponse => {

                        if (modulesBResponse) { this.listModules = modulesBResponse; }
                    },
                    (error) => {
                        this.isActivating = false;
                        console.log(error);
                    });
            },
            (error) => {
                this.isActivating = false;
                console.log(error);
            });
        }
    }


    activateModule(idModule: number, identificador: string, idBusiness: string) {

        this.moduleList = this.listModules.find(x => x.id === idModule && x.idSociedad === idBusiness && x.identificador === identificador);
        this.isActivating = true;

        this.accountService.activateModule(this.moduleList)
            .pipe(first())
            .subscribe( response => {

                if ( response.exito ){ this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
                } else { this.alertService.error(response.responseMesagge, { keepAfterRouteChange: true }); }
                this.isActivating = false;

                this.ngOnInit();
            },
            (error) => {
                this.isActivating = false;
                console.log(error);
            });
    }

    inActivateModule(idModule: number, identificador: string, idBusiness: string) {

        this.moduleList = this.listModules.find(x => x.id === idModule && x.idSociedad === idBusiness && x.identificador === identificador);
        this.isActivating = true;

        this.accountService.inActivateModule(this.moduleList)
            .pipe(first())
            .subscribe( response => {

                if ( response.exito ){ this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
                } else { this.alertService.error(response.responseMesagge, { keepAfterRouteChange: true }); }
                this.isActivating = false;

                this.ngOnInit();
            },
            (error) => {
                this.isActivating = false;
                console.log(error);
            });
    }
}
