import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User, Role } from '@app/_models';
import { Compania } from '../../_models/modules/compania';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { httpAccessAdminPage } from '@environments/environment';

@Component({templateUrl: 'HTML_AddBusinessUserPage.html',
            styleUrls: ['../../../assets/scss/app.scss', '../../../assets/scss/administrator/app.scss']
})
export class AddBusinessUserComponent extends OnSeguridad implements OnInit {

    userObservable: User;
    businessObservable: Compania;

    userToAssign: User = new User();
    business: Compania;

    _userIdentificationParam : string = null;

    role: Role = new Role();
    existeRol: boolean = false;

    isAsignBusiness: boolean;
    
    listAllBusiness: Compania[] = [];
    listBusinessUser: Compania[] = [];

    public HTTPListUserPage: string = httpAccessAdminPage.urlPageListUsers;

    listUserSubject : User[];

    public IdUserSessionRequest : string ;
    public UserSessionRequest : string ;
    public BusinessSessionRequest : string ;
    public ModuleSessionRequest : string ;

    constructor(private route: ActivatedRoute,
                private accountService: AccountService,
                private alertService: AlertService,
                private router: Router) {

        super(alertService, accountService, router);

        // ***************************************************************
        // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
        if (!super.userAuthenticateAdmin()                  ||
            !this.route.snapshot.params.pidentificationUser ||
            !this.accountService.userListValue) { this.accountService.logout(); return; }
        // ***************************************************************
        
        this.userObservable = this.accountService.userValue;
        this.businessObservable = this.accountService.businessValue;
        this.listUserSubject = this.accountService.userListValue;

        this._userIdentificationParam = this.route.snapshot.params.pidentificationUser;

        this.userToAssign = this.listUserSubject.find(x => x.identificacion === this._userIdentificationParam);

        this.consultarRolUsuarioCompania(this.userToAssign.idRol);
        this.inicializaHeaders();
    }

    inicializaHeaders() : void {
        this.IdUserSessionRequest = this.userObservable ? this.userObservable.id.toString() : 'noIdUserValue';
        this.UserSessionRequest = this.userObservable ? this.userObservable.nombreCompleto.toString() : 'noUserNameValue';
        this.BusinessSessionRequest = this.businessObservable ? this.businessObservable.id.toString() : 'noBusinessValue';
        this.ModuleSessionRequest = 'admin';

        // this.IdUserSessionRequest = this.userObservable.id.toString();
        // this.UserSessionRequest = this.userObservable.nombreCompleto.toString();
        // this.BusinessSessionRequest = this.businessObservable.id.toString();
        // this.ModuleSessionRequest = 'admin';
      }

    consultarRolUsuarioCompania(idRolUser : string) : void {

        if (idRolUser) {

            this.existeRol = true;

            this.accountService.getRolUserBusiness(this.userToAssign.idRol, this.businessObservable.id, this.IdUserSessionRequest,
                                                                                                        this.UserSessionRequest,
                                                                                                        this.BusinessSessionRequest,
                                                                                                        this.ModuleSessionRequest)
                .pipe(first())
                .subscribe(responseRole => { this.role = responseRole; });

        } else { this.role = null; }
    }

    ngOnInit() {

        this.accountService.getAllBusiness( this.IdUserSessionRequest,
                                            this.UserSessionRequest,
                                            this.BusinessSessionRequest,
                                            this.ModuleSessionRequest)
            .pipe(first())
            .subscribe(responseListBusiness => {

                if (responseListBusiness && responseListBusiness.length > 0) {

                    this.listAllBusiness = responseListBusiness;

                    this.accountService.getBusinessActiveUser(this.userToAssign.id, this.IdUserSessionRequest,
                                                                                    this.UserSessionRequest,
                                                                                    this.BusinessSessionRequest,
                                                                                    this.ModuleSessionRequest)
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
                        });
                } else {
                    this.listAllBusiness = null; 
                    this.listBusinessUser = null;
                    this.alertService.info('No se encontraron registro de empresas por el momento.');
                }
            },
            error => { this.alertService.error('Problemas al consultar la lista de compañías para la asignación del usuario seleccionado.' + error); });
    }

    assignBusinessUser(idBusiness: number) {

        this.alertService.clear();
        this.isAsignBusiness = true;

        let business : Compania = this.listAllBusiness.find(m => m.id == idBusiness);

        this.accountService.assignBusinessUser(this.userToAssign.id, idBusiness,this.IdUserSessionRequest,
                                                                                this.UserSessionRequest,
                                                                                this.BusinessSessionRequest,
                                                                                this.ModuleSessionRequest)
            .pipe(first())
            .subscribe( response => {

                if (response.exito) {

                    this.alertService.success(response.responseMesagge);

                    this.listAllBusiness.splice(this.listAllBusiness.findIndex( m => m.id == idBusiness ), 1);

                    if (this.listAllBusiness.length == 0) this.listAllBusiness = null;
                    
                    if (!this.listBusinessUser) this.listBusinessUser = [];
                    
                    this.listBusinessUser.push(business);

                } else { this.alertService.error(response.responseMesagge); }

                this.isAsignBusiness = false;
            },
            error => { this.isAsignBusiness = false; this.alertService.error(error); });
    }

    desAsignAllBusinessUser(idUser: number) {

        this.alertService.clear();

        this.accountService.dessAssignAllBusinessUser(idUser,   this.IdUserSessionRequest,
                                                                this.UserSessionRequest,
                                                                this.BusinessSessionRequest,
                                                                this.ModuleSessionRequest)
            .pipe(first())
            .subscribe( response => {

                if (response.exito) {

                    this.alertService.success(response.responseMesagge);

                    if (!this.listAllBusiness) this.listAllBusiness = [];
                    
                    this.listBusinessUser.forEach((businessUs) => {
                        this.listAllBusiness.push(businessUs);
                    });

                    this.listBusinessUser = null;

                } else {
                    this.alertService.error(response.responseMesagge);
                }
            },
            error => { this.alertService.error(error); });
    }

    dessAssignBusinessUser(idBusiness: number) {
        
        this.alertService.clear();

        let business : Compania = this.listBusinessUser.find(m => m.id == idBusiness);

        this.accountService.dessAssignBusinessUser(this.userToAssign.id,idBusiness, this.IdUserSessionRequest,
                                                                                    this.UserSessionRequest,
                                                                                    this.BusinessSessionRequest,
                                                                                    this.ModuleSessionRequest)
            .pipe(first())
            .subscribe( response => {

                if (response.exito) {

                    this.alertService.success(response.responseMesagge);

                    this.listBusinessUser.splice(this.listBusinessUser.findIndex( m => m.id == idBusiness ), 1);

                    if (this.listBusinessUser.length == 0) this.listBusinessUser = null;
                    
                    if (!this.listAllBusiness) this.listAllBusiness = [];
                    
                    this.listAllBusiness.push(business);

                } else { this.alertService.error(response.responseMesagge); }
            },
            error => { this.alertService.error(error); });
    }
}
