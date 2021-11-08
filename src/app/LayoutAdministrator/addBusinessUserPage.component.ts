import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

import { User } from '../_models';
import { Business } from '@app/_models/business';
import { Role } from '@app/_models/role';
import { ResponseMessage } from '@app/_models/response';

import { administrator } from '@environments/environment';

@Component({ templateUrl: 'HTML_AddBusinessUserPage.html' })
export class AddBusinessUserComponent implements OnInit {
    form: FormGroup;

    public userBusiness: User;

    public isAsignBusiness: boolean;

    public existeRol: boolean;
    public asignarEmrpesa: boolean;

    public isDesAsignBusiness: boolean;

    pUserId: string;

    response: ResponseMessage;

    loading = false;
    user: User;
    role: Role;

    public listAllBusiness: Business[] = [];
    public listBusinessUser: Business[] = [];

// hola cambio 

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
        this.existeRol = false;

        this.pUserId = this.route.snapshot.params.id;

        this.userBusiness = new User();
        this.role = new Role();

        if (this.pUserId !== administrator.id) {

            this.accountService.getUserById(this.pUserId)
            .pipe(first())
            .subscribe(responseUser => {

                this.userBusiness = responseUser;

                if (this.userBusiness.idRol) {

                    this.existeRol = true;

                    this.accountService.getRoleById(responseUser.idRol)
                    .pipe(first())
                    .subscribe(responseRole => {

                        this.role = responseRole;
                    },
                    error => {
                        this.alertService.error(error);
                        this.loading = false;
                    });
                } else { this.role = null; }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });

            this.accountService.getAllBusiness()
                    .pipe(first())
                    .subscribe(responseListBusiness => {

                        if (responseListBusiness.length > 0){

                            this.listAllBusiness = responseListBusiness;

                            this.accountService.getBusinessActiveUser(this.pUserId)
                            .pipe(first())
                            .subscribe(responseListBusinessUser => {

                                if (responseListBusinessUser.length > 0) {

                                    this.listBusinessUser = responseListBusinessUser;

                                    if (this.listBusinessUser.length === this.listAllBusiness.length) {
                                        this.listAllBusiness = null;

                                    } else {
                                        this.listBusinessUser.forEach((businessUs) => {

                                            this.listAllBusiness.forEach((businessList, index) => {

                                                if (businessUs.id === businessList.id) { this.listAllBusiness.splice(index, 1); }
                                            });
                                        });
                                    }
                                } else { this.listBusinessUser = null; }
                            });
                        } else { this.alertService.info('No hay registro de empresas registradas por el momento.'); }
                    });
        } else {
            this.router.navigate(['/_AdminModule/AdminListUserPage'], { relativeTo: this.route });
            this.alertService.info('No es necesario asignar empresas al usuario administrador.', { keepAfterRouteChange: true });
        }
    }

    assignBusinessUser(identificacionUsuario: string, idBusiness: string){
        this.isAsignBusiness = true;
        this.asignarEmrpesa = true;

        if (this.listBusinessUser){

            this.listBusinessUser.forEach((businessUs) => {

                if (businessUs.id === idBusiness) {
                    this.asignarEmrpesa = false;
                }
            });
        }

        if (this.asignarEmrpesa){

            this.accountService.assignBusinessUser(identificacionUsuario, idBusiness)
            .pipe(first())
            .subscribe(
                response => {

                    this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
                    this.isAsignBusiness = false;

                    this.ngOnInit();
                },
                error => {
                    console.log(error);
                    this.alertService.error(error);
                    this.loading = false;
                });
        } else { this.alertService.info('Esta emrpesa ya está asignada al usuario.', { keepAfterRouteChange: true }); }
    }

    desAsignAllBusinessUser(identificacionUsuario: string){

        this.isDesAsignBusiness = true;

        this.accountService.dessAssignAllBusinessUser(identificacionUsuario)
            .pipe(first())
            .subscribe(
                response => {

                    this.isDesAsignBusiness = false;

                    if (response.exito){

                        this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
                    }
                    else{
                        this.alertService.error(response.responseMesagge, { keepAfterRouteChange: true });
                    }

                    this.ngOnInit();
                },
                error => {
                    console.log(error);
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    dessAssignBusinessUser(identificacionUsuario: string, idBusiness: string){
        this.isAsignBusiness = true;

        this.accountService.dessAssignBusinessUser(identificacionUsuario, idBusiness)
            .pipe(first())
            .subscribe(
                response => {

                    this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
                    this.isAsignBusiness = false;

                    this.ngOnInit();
                },
                error => {
                    console.log(error);
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
