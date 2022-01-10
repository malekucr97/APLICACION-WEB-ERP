import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User, Role, ResponseMessage } from '@app/_models';
import { administrator, httpAccessAdminPage } from '@environments/environment-access-admin';
import { Compania } from '../../_models/modules/compania';

@Component({ templateUrl: 'HTML_AddRoleUserPage.html' })
export class AddRoleUserComponent implements OnInit {
    form: FormGroup;

    user: User;
    userRole: User;
    role: Role;
    response: ResponseMessage;

    listAllRoles: Role[] = [];
    listBusinessUser: Compania[] = [];

    existeRol: boolean;
    isDesAsignRoles: boolean;
    isAsignRole: boolean;

    pUserId: string;

    constructor(
            private route: ActivatedRoute,
            private accountService: AccountService,
            private alertService: AlertService,
            private router: Router) { this.user = this.accountService.userValue; }

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

                    // -- >> elimina el rol administrador del listado que se muestra para la asignación de roles
                    this.listAllRoles.forEach((element, index) => {
                        if (element.id === administrator.id) { this.listAllRoles.splice(index, 1) ; }
                    });
                },
                error => { this.alertService.error(error); });

            this.accountService.getUserById(this.pUserId)
                .pipe(first())
                .subscribe(responseUser => {

                    this.userRole = responseUser;

                    if (this.userRole.idRol) {

                        this.existeRol = true;

                        this.accountService.getRoleById(responseUser.idRol)
                            .pipe(first())
                            .subscribe(responseRole => { this.role = responseRole; });
                    }
                });

        } else {
            this.router.navigate([httpAccessAdminPage.urlPageListUsers], { relativeTo: this.route });
            this.response.responseMesagge = 'No es posible actualizar el rol del administrador.';
            this.alertService.info(this.response.responseMesagge, { keepAfterRouteChange: true });
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
                error => { console.log(error); this.alertService.error(error); });
    }

    desAsignAllRolesUser(identificacionUsuario: string) {

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
                    else {
                        this.alertService.info(response.responseMesagge, { keepAfterRouteChange: true });
                    }

                    this.ngOnInit();
                },
                error => { console.log(error); this.alertService.error(error); });
    }
}
