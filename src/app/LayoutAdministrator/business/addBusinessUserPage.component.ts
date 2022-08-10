import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User, Role, ResponseMessage } from '@app/_models';
import { administrator, httpAccessAdminPage } from '@environments/environment-access-admin';
import { Compania } from '../../_models/modules/compania';

@Component({ templateUrl: 'HTML_AddBusinessUserPage.html' })
export class AddBusinessUserComponent implements OnInit {
    form: FormGroup;

    user: User;
    userBusiness: User;
    role: Role;
    response: ResponseMessage;

    isAsignBusiness: boolean;
    existeRol: boolean;
    asignarEmrpesa: boolean;
    isDesAsignBusiness: boolean;

    pUserId: string;
    URLListUsersPage: string;

    listAllBusiness: Compania[] = [];
    listBusinessUser: Compania[] = [];

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

        this.URLListUsersPage = httpAccessAdminPage.urlPageListUsers;

        if (this.pUserId !== administrator.id) {

            this.accountService.getUserByIdentification(this.pUserId)
            .pipe(first())
            .subscribe(responseUser => {

                this.userBusiness = responseUser;

                if (this.userBusiness.idRol) {

                    this.existeRol = true;

                    this.accountService.getRoleById(responseUser.idRol)
                    .pipe(first())
                    .subscribe(responseRole => { this.role = responseRole; },
                    error => { this.alertService.error(error); });

                } else { this.role = null; }
            },
            error => { this.alertService.error(error); });

            this.accountService.getAllBusiness()
                    .pipe(first())
                    .subscribe(responseListBusiness => {
                        if (responseListBusiness) {
                            this.listAllBusiness = responseListBusiness;

                            this.accountService.getBusinessActiveUser(this.pUserId)
                            .pipe(first())
                            .subscribe(responseListBusinessUser => {
                                if (responseListBusinessUser) {
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
                        } else {
                            this.response.responseMesagge = 'No hay registro de empresas registradas por el momento.';
                            this.alertService.info(this.response.responseMesagge);
                        }
                    });
        } else {
            this.router.navigate([httpAccessAdminPage.urlPageListUsers], { relativeTo: this.route });
            this.response.responseMesagge = 'El usuario Administrador tiene acceso a todas las Empresas.';
            this.alertService.info(this.response.responseMesagge, { keepAfterRouteChange: true });
        }
    }

    assignBusinessUser(identificacionUsuario: string, idBusiness: number){
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
                error => { console.log(error); this.alertService.error(error); });
        } else { this.alertService.info('Esta emrpesa ya está asignada al usuario.', { keepAfterRouteChange: true }); }
    }

    desAsignAllBusinessUser(idUser: number){

        this.isDesAsignBusiness = true;

        this.accountService.dessAssignAllBusinessUser(idUser)
            .pipe(first())
            .subscribe(
                response => {

                    this.isDesAsignBusiness = false;

                    if (response.exito) {

                        this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
                    } else {
                        this.alertService.error(response.responseMesagge, { keepAfterRouteChange: true });
                    }

                    this.ngOnInit();
                },
                error => { console.log(error); this.alertService.error(error); this.isDesAsignBusiness = false; });
    }

    dessAssignBusinessUser(identificacionUsuario: string, idBusiness: number){
        this.isAsignBusiness = true;

        this.accountService.dessAssignBusinessUser(identificacionUsuario, idBusiness)
            .pipe(first())
            .subscribe(
                response => {

                    this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
                    this.isAsignBusiness = false;

                    this.ngOnInit();
                },
                error => { console.log(error); this.alertService.error(error); this.isAsignBusiness = false; });
    }
}
