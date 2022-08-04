import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User, Module } from '@app/_models';
import { Compania } from '../../_models/modules/compania';

@Component({ templateUrl: 'HTML_ListModulePage.html' })
export class ListModuleComponent implements OnInit {
    user: User;
    moduleList: Module;
    businessMod: Compania;

    listModulesBusiness: Module[] = [];
    listAllModulesSystem: Module[] = [];
    
    listBusiness: Compania[] = [];
    

    isActivating: boolean;
    isDeleting: boolean;
    isAssigning: boolean;
    isDesAssigning: boolean;

    adminBoss: boolean;
    adminBusiness: boolean;

    URLAddEditUsertPage: string;
    URLAddBusinessUsertPage: string;
    URLAddRoleUsertPage: string;
    idBusiness: string;
    pidBusiness: number;

    seleccionEmpresa: boolean;

    constructor(private accountService: AccountService,
                private route: ActivatedRoute,
                private alertService: AlertService) { this.user = this.accountService.userValue; }

    ngOnInit() {

        this.alertService.clear();

        this.isActivating   = false;
        this.isDeleting     = false;
        this.isAssigning    = false;
        this.isDesAssigning = false;
        
        this.seleccionEmpresa = false;

        this.listModulesBusiness = null;
        this.listAllModulesSystem = null;

        this.pidBusiness = this.route.snapshot.params.pidBusiness;

        if (this.pidBusiness) {

            this.seleccionEmpresa = true;
            this.businessMod = new Compania();

            this.accountService.getBusinessById(this.pidBusiness)
            .pipe(first())
            .subscribe(businessResponse => {

                this.businessMod = businessResponse;

                this.accountService.getModulesBusiness(this.businessMod.id)
                    .pipe(first())
                    .subscribe(modulesBResponse => {

                        if (modulesBResponse) {

                            this.listModulesBusiness = modulesBResponse;

                            this.accountService.getModulesSystem()
                                .pipe(first())
                                .subscribe(responseModulesActive => {

                                    if (responseModulesActive) {

                                        this.listAllModulesSystem = responseModulesActive;

                                        if (this.listAllModulesSystem.length === this.listModulesBusiness.length) { 
                                            this.listAllModulesSystem = null;
                                        } else {

                                            this.listModulesBusiness.forEach((moduleBusiness) => {

                                                this.listAllModulesSystem.forEach((moduleListActive, index) => {

                                                    if (moduleBusiness.identificador === moduleListActive.identificador) {
                                                        this.listAllModulesSystem.splice(index, 1);
                                                    }
                                                });
                                            });

                                        }
                                    } else { this.listAllModulesSystem = null; }
                                });
                        }
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

        } else {

            // Consulta todos los módulos activos que se pueden asignar a una compañía
            this.accountService.getModulesSystem()
                .pipe(first())
                .subscribe(responseModulesActive => {

                    if (responseModulesActive) {

                        this.listAllModulesSystem = responseModulesActive;

                    } else { this.listAllModulesSystem = null; }
                },
                (error) => {
                    this.isActivating = false;
                    console.log(error);
                });
        }
    }

    // Activar módulo de Compañía
    activateModuleBusiness(idModule: number, identificador: string, idBusiness: number) {

        this.moduleList = this.listModulesBusiness.find(x => x.id === idModule && x.idSociedad === idBusiness && x.identificador === identificador);
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

    inActivateModuleBusiness(idModule: number, identificador: string, idBusiness: number) {

        this.moduleList = this.listModulesBusiness.find(x => x.id === idModule && x.idSociedad === idBusiness && x.identificador === identificador);
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


    // -->> Procedimientos actualziados - LLMADO A SERVICIO DE MODULES BACKEND
    assignModuleBusiness(moduleId:number, businessId:number) : void {

        this.isAssigning = true;

        let moduleToAssign:Module = this.listAllModulesSystem.find(x => x.id === moduleId);
        moduleToAssign.idSociedad = businessId;

        this.accountService.assignModuleToBusiness(moduleToAssign)
            .pipe(first())
            .subscribe( response => {

                if (response.exito) {

                    this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });

                } else { this.alertService.error(response.responseMesagge, { keepAfterRouteChange: true }); }

                this.isAssigning = false;
                this.ngOnInit();
            },
            error => {
                console.log(error);
                this.alertService.error(error);
            });
    }
    desAssignModuleBusiness(moduleId:number, businessId:number) : void {

        this.isDesAssigning = true;

        let moduleToDesAssign : Module = this.listModulesBusiness.find(x => x.id === moduleId && x.idSociedad === businessId);

        this.accountService.desAssignModuleToBusiness(moduleToDesAssign.id, moduleToDesAssign.idSociedad)
            .pipe(first())
            .subscribe( response => {

                if (response.exito) {

                    this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });

                } else { this.alertService.warn(response.responseMesagge, { keepAfterRouteChange: true }); }

                this.isDesAssigning = false;
                this.ngOnInit();
            },
            error => {
                console.log(error);
                this.alertService.error(error);
            });
    }
    opcionesSubMenu(moduleId:number) : void {

        this.isDesAssigning = true;

        // let moduleToDesAssign : Module = this.listModulesBusiness.find(x => x.id === moduleId && x.idSociedad === businessId);

        // this.modulesService.desAssignModuleToBusiness(moduleToDesAssign.id, moduleToDesAssign.idSociedad)
        //     .pipe(first())
        //     .subscribe( response => {

        //         if (response.exito) {

        //             this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });

        //         } else { this.alertService.warn(response.responseMesagge, { keepAfterRouteChange: true }); }

        //         this.isDesAssigning = false;
        //         this.ngOnInit();
        //     },
        //     error => {
        //         console.log(error);
        //         this.alertService.error(error);
        //     });
    }
    

    
}
