import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User, Role } from '@app/_models';
import { administrator, httpAccessAdminPage, httpLandingIndexPage } from '@environments/environment-access-admin';

@Component({ templateUrl: 'HTML_AddRoleUserPage.html' })
export class AddRoleUserComponent implements OnInit {
    userObservable: User;

    userToAssign: User = new User();
    role: Role;

    listAllRoles: Role[] = [];

    isRolAssign: boolean = false;
    isDesAsignRoles: boolean;
    isAsignRole: boolean;

    private Index:string = httpLandingIndexPage.indexHTTP;
    public HTTPListUserPage : string = httpAccessAdminPage.urlPageListUsers;

    listUserSubject : User[];

    constructor(private route: ActivatedRoute,
                private accountService: AccountService,
                private alertService: AlertService,
                private router: Router) { 
            
            this.userObservable = this.accountService.userValue;
            this.listUserSubject = this.accountService.userListValue;
        }

    ngOnInit() {

        this.alertService.clear();

        if (!this.accountService.userListValue) { this.router.navigate([this.HTTPListUserPage]); return; }
        if (!this.userObservable.esAdmin) { this.router.navigate([this.Index]); return; }
        if (!this.route.snapshot.params.id) { this.router.navigate([this.HTTPListUserPage]); return; }

        let pUserId : string = this.route.snapshot.params.id;

        if (pUserId !== administrator.id) {

            this.userToAssign = this.listUserSubject.find(x => x.identificacion === pUserId);
            this.accountService.loadListUsers(this.listUserSubject);

            this.accountService.getAllRoles()
                .pipe(first())
                .subscribe(responseListRole => {
                    this.listAllRoles = responseListRole;

                    // elimina el rol administrador del listado que se muestra en pantalla
                    this.listAllRoles.splice(this.listAllRoles.findIndex( r => r.id == administrator.id ), 1);

                    if (this.userToAssign.idRol) {
                        this.isRolAssign = true;
                        this.role = this.listAllRoles.find(x => x.id === this.userToAssign.idRol);
                    }
                },
                error => {
                    this.alertService.error(error); 
                });

        } else {
            let message : string = 'No es posible actualizar el rol del administrador.';
            this.alertService.info(message, { keepAfterRouteChange: true });
            this.router.navigate([httpAccessAdminPage.urlPageListUsers], { relativeTo: this.route });
        }
    }

    assignRoleUser(idRole: string) : void {

        this.alertService.clear();
        this.isAsignRole = true;

        this.accountService.assignRoleUser(idRole, this.userToAssign.identificacion)
            .pipe(first())
            .subscribe( response => {

                if (response.exito) {

                    this.role = this.listAllRoles.find(x => x.id === idRole);
                    this.isRolAssign = true;

                    this.userToAssign.idRol = idRole;
                    this.listUserSubject[this.listUserSubject.findIndex( u => u.id == this.userToAssign.id )] = this.userToAssign;
                    this.accountService.loadListUsers(this.listUserSubject);

                    this.alertService.success(response.responseMesagge);
                    
                } else {
                    this.alertService.error(response.responseMesagge);
                }
                this.isAsignRole = false;
            },
            error => { this.isAsignRole = false; this.alertService.error(error); });
    }

    desAsignAllRolesUser() {

        this.isDesAsignRoles = true;

        this.accountService.removeRoleUser(this.userToAssign)
            .pipe(first())
            .subscribe( response => {

                if (response.exito) {

                    this.role = null;
                    this.isRolAssign = false;

                    this.userToAssign.idRol = null;
                    this.listUserSubject[this.listUserSubject.findIndex( u => u.id == this.userToAssign.id )] = this.userToAssign;
                    this.accountService.loadListUsers(this.listUserSubject);

                    this.alertService.success(response.responseMesagge);

                } else {
                    this.alertService.error(response.responseMesagge, { keepAfterRouteChange: true });
                }

                this.isDesAsignRoles = false;
            },
            error => { console.log(error); this.alertService.error(error); });
    }
}
