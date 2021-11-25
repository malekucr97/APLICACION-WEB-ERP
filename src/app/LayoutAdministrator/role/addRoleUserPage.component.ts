import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

import { User, Business, Role, ResponseMessage } from '@app/_models';

import { administrator } from '@environments/environment';

@Component({ templateUrl: 'HTML_AddRoleUserPage.html' })
export class AddRoleUserComponent implements OnInit {
    form: FormGroup;

    public userRole: User;
    public listAllRoles: Role[] = [];

    public role: Role;
    public existeRol: boolean;
    public isDesAsignRoles: boolean;

    public isAsignRole: boolean;
    pUserId: string;

    response: ResponseMessage;

    loading = false;
    user: User;

    public listBusinessUser: Business[] = [];


    constructor(
        private route: ActivatedRoute,
        private accountService: AccountService,
        private alertService: AlertService,
        private router: Router,
    ) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {

        this.pUserId = this.route.snapshot.params.id;

        this.alertService.clear();

        if (this.pUserId !== administrator.id) {

            this.userRole = new User();

            this.role = new Role();
            this.existeRol = false;

            this.accountService.getAllRoles()
                .pipe(first())
                .subscribe(responseListRole => {
                    this.listAllRoles = responseListRole;

                    // -- >> elimina el rol administrador del listado que se muetsra para la asignación de roles
                    this.listAllRoles.forEach((element, index) => {
                        if (element.id === administrator.id) { this.listAllRoles.splice(index, 1) ; }
                    });
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });

            this.accountService.getUserById(this.pUserId)
                .pipe(first())
                .subscribe(responseUser => {

                    this.userRole = responseUser;

                    if (this.userRole.idRol) {

                        this.existeRol = true;

                        this.accountService.getRoleById(responseUser.idRol)
                            .pipe(first())
                            .subscribe(responseRole => {

                                this.role = responseRole;
                            });
                    }
                });

        } else {
            this.router.navigate(['/_AdminModule/AdminListUserPage'], { relativeTo: this.route });
            this.alertService.info('No es posible actualizar el rol del administrador.', { keepAfterRouteChange: true });
        }
    }

    assignRoleUser(idRole: string, idUser){
        this.isAsignRole = true;

        this.accountService.assignRoleUser(idRole, idUser)
            .pipe(first())
            .subscribe(
                response => {

                    this.isAsignRole = false;
                    this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });

                    this.ngOnInit();
                },
                error => {
                    console.log(error);
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    desAsignAllRolesUser(identificacionUsuario: string){

        this.isDesAsignRoles = true;

        this.userRole.identificacion = identificacionUsuario;

        this.accountService.removeRoleUser(this.userRole)
            .pipe(first())
            .subscribe(
                response => {

                    this.isDesAsignRoles = false;

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
}
