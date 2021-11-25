import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

import { User, Business, Role, Module, ResponseMessage } from '@app/_models';

import { administrator } from '@environments/environment';

@Component({ templateUrl: 'HTML_AddModuleRolePage.html' })
export class AddModuleRoleComponent implements OnInit {
    form: FormGroup;

    access: boolean;

    module: Module;

    administrador: boolean;

    pRoleId: string; pNomRole: string; pDescRole: string; pEsAdmin: number;

    response: ResponseMessage;

    user: User;
    role: Role;

    business: Business;

    public listModulesRol: Module[] = [];
    public listModulesActive: Module[] = [];

    public seleccionEmpresa: boolean;

    constructor(
        private route: ActivatedRoute,
        private accountService: AccountService,
        private alertService: AlertService,
        private router: Router,
    ) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {

        this.alertService.clear();
        this.seleccionEmpresa = false;

        this.administrador = false;

        this.listModulesRol = null;
        this.listModulesActive = null;

        this.role = new Role();
        this.business = new Business();

        if (this.user.empresa) {

            this.seleccionEmpresa = true;

            this.pRoleId = this.route.snapshot.params.pidRole;
            this.pNomRole = this.route.snapshot.params.pnom;
            this.pDescRole = this.route.snapshot.params.pdesc;
            this.pEsAdmin = this.route.snapshot.params.pesadmin;

            this.accountService.getBusinessById(this.user.empresa)
                .pipe(first())
                .subscribe(responseBusiness => {
                    this.business = responseBusiness;
                });

            if (Number(this.pEsAdmin) !== administrator.esAdministrador) {

                this.accountService.getModulesRolBusiness(this.pRoleId, this.user.empresa)
                .pipe(first())
                .subscribe(responseModulesRolB => {

                    if (responseModulesRolB) {

                        this.listModulesRol = responseModulesRolB;

                        this.accountService.getModulesActive()
                        .pipe(first())
                        .subscribe(responseModulesActive => {

                            if (responseModulesActive) {

                                this.listModulesActive = responseModulesActive;

                                if (this.listModulesActive.length === this.listModulesRol.length) { this.listModulesActive = null;
                                } else {

                                    this.listModulesRol.forEach((modRol) => {

                                        this.listModulesActive.forEach((modList, index) => {

                                            if (modRol.identificador === modList.identificador) {
                                                this.listModulesActive.splice(index, 1);
                                            }
                                        });
                                    });

                                }
                            } else { this.listModulesActive = null; }
                        });
                    } else { this.listModulesRol = null; }
                });
            } else { this.administrador = true; }
        }
    }

    acceso(identificadorModulo: string, nombreModulo: string, descModulo: string){

        this.access = true;

        this.module = new Module();
        this.module.identificador = identificadorModulo;
        this.module.idSociedad = this.business.id;
        this.module.nombre = nombreModulo;
        this.module.descripcion = descModulo;
        this.module.estado = 'Activo';

        this.accountService.getModulesIdIdBusiness(this.module.identificador, this.module.idSociedad)
            .pipe(first())
            .subscribe( moduleResponse => {

                this.accountService.accessModule(this.pRoleId, moduleResponse.id)
                    .pipe(first())
                    .subscribe( response => {

                        if (response.exito) {

                            this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });

                        } else { this.alertService.error(response.responseMesagge, { keepAfterRouteChange: true }); }

                        this.access = false;
                        this.ngOnInit();
                    },
                    error => {
                        console.log(error);
                        this.alertService.error(error);
                    });
        },
        error => {
            console.log(error);
            this.alertService.error(error);
        });
    }
    eliminarAcceso(idMod: number){

        this.access = true;

        this.accountService.deleteAccessModule(this.pRoleId, idMod)
            .pipe(first())
            .subscribe( responseDeleteAccess => {

                if (responseDeleteAccess.exito) {

                        if (responseDeleteAccess.exito) {

                            this.alertService.success(responseDeleteAccess.responseMesagge, { keepAfterRouteChange: true });

                        } else { this.alertService.error(responseDeleteAccess.responseMesagge, { keepAfterRouteChange: true }); }

                        this.access = false;
                        this.ngOnInit();

                } else { this.alertService.error(responseDeleteAccess.responseMesagge, { keepAfterRouteChange: true }); }
            },
            error => {
                console.log(error);
                this.alertService.error(error, { keepAfterRouteChange: true });
                this.access = false;
                this.ngOnInit();
            });
    }
}
