import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User, Role } from '@app/_models';
import { httpAccessAdminPage, httpLandingIndexPage } from '@environments/environment-access-admin';
import { Compania } from '../../_models/modules/compania';
import { administrator } from '@environments/environment';

@Component({ templateUrl: 'HTML_AddBusinessUserPage.html' })
export class AddBusinessUserComponent implements OnInit {

    userObservable: User;

    userToAssign: User = new User();
    role: Role = new Role();
    business: Compania;

    _userIdParam : string = null;

    isAsignBusiness: boolean;
    existeRol: boolean = false;
    isDesAsignBusiness: boolean;
    
    listAllBusiness: Compania[] = [];
    listBusinessUser: Compania[] = [];

    public HTTPListUserPage: string = httpAccessAdminPage.urlPageListUsers;
    private Index:string = httpLandingIndexPage.indexHTTP;

    listUserSubject : User[];

    constructor(private route: ActivatedRoute,
                private accountService: AccountService,
                private alertService: AlertService,
                private router: Router) {
        
            this.userObservable = this.accountService.userValue;
            this.listUserSubject = this.accountService.userListValue;

            if (!this.route.snapshot.params.id) { this.router.navigate([this.HTTPListUserPage]); return; }
            this._userIdParam = this.route.snapshot.params.id;

            if (!this.userObservable || !this.userObservable.esAdmin) { this.router.navigate([this.HTTPListUserPage]); return; }
            if (!this.listUserSubject) { this.router.navigate([this.HTTPListUserPage]); return; }
            
            this.userToAssign = this.listUserSubject.find(x => x.identificacion === this._userIdParam);
    }

    ngOnInit() {

        // this.alertService.clear();

        // if (!this.accountService.userListValue) this.router.navigate([this.HTTPListUserPage]);
            // return;
        // }
        // if (!this.userObservable.esAdmin) this.router.navigate([this.Index]);
        //     return;
        // }
        // if (!this.route.snapshot.params.id) {
        //     this.router.navigate([this.HTTPListUserPage]);
        //     return;
        // }

        // let pUserId = this.route.snapshot.params.id;

        // if (this._userIdParam !== administrator.identification) {

            // this.userToAssign = this.listUserSubject.find(x => x.identificacion === this._userIdParam);

            if (this.userToAssign.idRol) {

                this.existeRol = true;

                this.accountService.getRoleById(this.userToAssign.idRol)
                    .pipe(first())
                    .subscribe(responseRole => { this.role = responseRole; });

            } else { this.role = null; }

            this.accountService.getAllBusiness()
                .pipe(first())
                .subscribe(responseListBusiness => {

                    if (responseListBusiness && responseListBusiness.length > 0) {

                        this.listAllBusiness = responseListBusiness;

                        this.accountService.getBusinessActiveUser(this.userToAssign.id)
                            .pipe(first())
                            .subscribe(responseListBusinessUser => {

                                if (responseListBusinessUser && responseListBusinessUser.length > 0) {

                                    this.listBusinessUser = responseListBusinessUser;

                                    if (this.listBusinessUser.length !== this.listAllBusiness.length) {
                                        
                                        this.listBusinessUser.forEach((businessUs) => {
                                            this.listAllBusiness.splice(this.listAllBusiness.findIndex( b => b.id == businessUs.id ), 1);
                                        });

                                    } else { this.listAllBusiness = null; }

                                } else { this.listBusinessUser = null; }

                                // if (this.listBusinessUser && this.listBusinessUser.length > 0) {

                                    // if (this.listBusinessUser.length !== this.listAllBusiness.length) {
                                        
                                    //     this.listBusinessUser.forEach((businessUs) => {
                                    //         this.listAllBusiness.splice(this.listAllBusiness.findIndex( b => b.id == businessUs.id ), 1);
                                    //     });

                                    // } else { this.listAllBusiness = null; }

                                // } else { this.listBusinessUser = null; }
                            },
                            error => { this.alertService.error('Problemas al consultar la lista de compañías para el usuario seleccionado.' + error); });

                    } else {
                        this.listAllBusiness = null; this.listBusinessUser = null;
                        this.alertService.info('No se encontraron registro de empresas por el momento.');
                    }
                });
        // } else {
        //     let message = 'El usuario Administrador tiene acceso a todas las Empresas.';
        //     this.alertService.info(message, { keepAfterRouteChange: true });
        //     this.router.navigate([this.HTTPListUserPage], { relativeTo: this.route });
        // }
    }

    assignBusinessUser(idBusiness: number) {

        this.alertService.clear();
        this.isAsignBusiness = true;

        let business : Compania = this.listAllBusiness.find(m => m.id == idBusiness);

        this.accountService.assignBusinessUser(this.userToAssign.id, idBusiness)
            .pipe(first())
            .subscribe( response => {

                if (response.exito) {

                    this.alertService.success(response.responseMesagge);

                    this.listAllBusiness.splice(this.listAllBusiness.findIndex( m => m.id == idBusiness ), 1);
                    if (this.listAllBusiness.length == 0) {
                        this.listAllBusiness = null;
                    }

                    if (!this.listBusinessUser) {
                        this.listBusinessUser = [];
                    }
                    this.listBusinessUser.push(business);

                } else {
                    this.alertService.error(response.responseMesagge);
                }
                this.isAsignBusiness = false;
            },
            error => { this.isAsignBusiness = false; this.alertService.error(error); });
    }

    desAsignAllBusinessUser(idUser: number) {

        this.alertService.clear();
        this.isDesAsignBusiness = true;

        this.accountService.dessAssignAllBusinessUser(idUser)
            .pipe(first())
            .subscribe( response => {

                if (response.exito) {

                    this.alertService.success(response.responseMesagge);

                    if (!this.listAllBusiness) {
                        this.listAllBusiness = [];
                    }
                    this.listBusinessUser.forEach((businessUs) => {
                        this.listAllBusiness.push(businessUs);
                    });

                    this.listBusinessUser = null;

                } else {
                    this.alertService.error(response.responseMesagge);
                }
                this.isDesAsignBusiness = false;
            },
            error => { this.alertService.error(error); this.isDesAsignBusiness = false; });
    }

    dessAssignBusinessUser(idBusiness: number){
        
        this.alertService.clear();
        this.isDesAsignBusiness = true;

        let business : Compania = this.listBusinessUser.find(m => m.id == idBusiness);

        this.accountService.dessAssignBusinessUser(this.userToAssign.id, idBusiness)
            .pipe(first())
            .subscribe( response => {

                if (response.exito) {

                    this.alertService.success(response.responseMesagge);

                    this.listBusinessUser.splice(this.listBusinessUser.findIndex( m => m.id == idBusiness ), 1);
                    if (this.listBusinessUser.length==0) {
                        this.listBusinessUser = null;
                    }

                    if (!this.listAllBusiness) {
                        this.listAllBusiness = [];
                    }
                    this.listAllBusiness.push(business);

                } else { this.alertService.error(response.responseMesagge); }

                this.isDesAsignBusiness = false;
            },
            error => { this.alertService.error(error); this.isDesAsignBusiness = false; });
    }
}
