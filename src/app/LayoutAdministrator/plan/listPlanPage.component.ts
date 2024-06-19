import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { administrator, httpAccessAdminPage } from '@environments/environment';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';
import { AdminPlan } from '@app/_models/admin/planes/plan';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';
import { User } from '@app/_models/user';
import { AdminPlanXBusiness } from '@app/_models/admin/planes/planxBusiness';

@Component({templateUrl:'HTML_ListPlanPage.html',
            styleUrls:['../../../assets/scss/app.scss', '../../../assets/scss/administrator/app.scss']
})
export class ListPlanComponent extends OnSeguridad implements OnInit {

    public URLAdministratorPage: string;
    public urlPageAddEditPlan: string;

    public listPlanes: AdminPlan[];
    public planBusiness: AdminPlan;

    public addPlanBusiness: boolean;
    public idBusinessSelected: number;

    public technicalUser: string;
    public adminBusinessUser: string;

    constructor(private accountService: AccountService, 
                private router: Router,
                private route: ActivatedRoute,
                private alertService: AlertService,
                private dialogo: MatDialog,
                private translateMessagesService: TranslateMessagesService,
                private translate: TranslateMessagesService) {

        super(alertService, accountService, router, translate);

        // ***************************************************************
        // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
        if (!super.userAuthenticateAdmin()) { this.accountService.logout(); return; }
        // ***************************************************************

        this.URLAdministratorPage = httpAccessAdminPage.urlPageAdministrator;
        this.urlPageAddEditPlan = httpAccessAdminPage.urlPageAddEditPlan;
        this.technicalUser = administrator.identification;
        this.adminBusinessUser = administrator.adminSociedad;

        this.listPlanes = [];
        this.planBusiness = null;

        this.addPlanBusiness = false;
    }

    public redirectAdminUsersPage() : void { this.router.navigate([this.URLAdministratorPage]); }

    ngOnInit() {

        if (this.route.snapshot.params.pidBusiness){
            this.addPlanBusiness = true;
            this.idBusinessSelected = this.route.snapshot.params.pidBusiness;
            this.URLAdministratorPage = httpAccessAdminPage.urlPageListBusiness;
        }

        this.accountService.getAllPlanes(this._HIdUserSessionRequest, this._HBusinessSessionRequest)
            .pipe(first())
            .subscribe(response => {
                
                if(response && response.length > 0) this.listPlanes=response;

                if (this.addPlanBusiness && this.listPlanes) {

                    // get plan business
                    this.accountService.getPlanBusiness(this.idBusinessSelected,
                                                        this._HIdUserSessionRequest,
                                                        this._HBusinessSessionRequest)
                        .pipe(first())
                        .subscribe(response => {

                            if(response) {

                                this.planBusiness = response;
                                this.listPlanes.splice( this.listPlanes.findIndex((m) => m.id == this.planBusiness.id), 1 );

                                if (this.listPlanes.length === 0) this.listPlanes = null;
                            }
                        });
                }
            });
    }

    public asignarPlan(idPlan:number) {

        this.alertService.clear();

        if (!this.planBusiness) {

            let plan: AdminPlan = this.listPlanes.find((m) => m.id == idPlan);

            let listUsers: User[] = [];

            let cantAdministradores : number = 0;
            let cantFuncionales : number = 0;

            let cantMaxAdministradores : number = plan.maximoAdministradores;
            let cantMaxFuncionales : number = plan.maximoFuncionales;

            this.accountService.getUsersBusiness(   this.idBusinessSelected,
                                                    this._HIdUserSessionRequest,
                                                    this._HBusinessSessionRequest)
                .pipe(first())
                .subscribe((response) => {
                
                    if (response && response.length > 0) {
                        
                        listUsers = response;
                        listUsers.splice( listUsers.findIndex((m) => m.identificacion == this.technicalUser), 1 );

                        cantFuncionales = listUsers.length;
                        cantAdministradores = this.cantidadAdministradores(listUsers);
                        cantFuncionales = cantFuncionales - cantAdministradores;

                        if (cantFuncionales <= cantMaxFuncionales && cantAdministradores <= cantMaxAdministradores) {

                            let fechaRegistro : Date = new Date();

                            let objPlanBusiness : AdminPlanXBusiness = new AdminPlanXBusiness(  idPlan,
                                                                                                this.idBusinessSelected,
                                                                                                cantAdministradores,
                                                                                                cantFuncionales,
                                                                                                this._HIdUserSessionRequest,
                                                                                                fechaRegistro);
                            this.accountService.addPlanBusiness(objPlanBusiness,
                                                                this._HIdUserSessionRequest,
                                                                this._HBusinessSessionRequest)
                                .pipe(first())
                                .subscribe((response) => {
                    
                                    if (response.exito) {

                                        this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
                                        window.location.reload();
                    
                                    } else { this.alertService.error(response.responseMesagge, { keepAfterRouteChange: true }); }
                                },
                                (error) => { this.alertService.error(error); });

                        } else { this.alertService.info(this.translateMessagesService.translateKey('ALERTS.USER_COUNT_NOT_ALLOWED')); }
                    }
                });
            
        } else { this.alertService.info(this.translateMessagesService.translateKey('ALERTS.PLAN_HAS_BEEN_ALREADY_ASSIGNED')); }
    }

    public removerPlan(idPlan:number) {

        this.alertService.clear();
    
          this.dialogo.open(DialogoConfirmacionComponent, { data: this.translateMessagesService.translateKey('ALERTS.PLAN_DES_ASSIGNED') })
                .afterClosed()
                .subscribe((confirmado: Boolean) => {
    
                    if (confirmado) {
    
                        this.accountService.removePlanBusiness( idPlan, 
                                                                this.idBusinessSelected,
                                                                this._HIdUserSessionRequest,
                                                                this._HBusinessSessionRequest)
                            .pipe(first())
                            .subscribe((response) => {
              
                                if (response.exito) {

                                    this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
                                    window.location.reload();
                    
                                } else { this.alertService.error(response.responseMesagge); }
                        
                            }, (error) => { this.alertService.error(error); });
    
                    } else { return; }
                });
    }

    public deletePlan(idPlan : number) {

        this.alertService.clear();
    
        this.dialogo.open(DialogoConfirmacionComponent, { data: this.translateMessagesService.translateKey('ALERTS.dialogConfirmDelete') })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {

                if (confirmado) {

                    this.accountService.deletePlan( idPlan,
                                                    this._HIdUserSessionRequest,
                                                    this._HBusinessSessionRequest)
                        .pipe(first())
                        .subscribe((responseDelete) => {
            
                            if (responseDelete.exito) {
                                this.alertService.success(responseDelete.responseMesagge);
                                this.listPlanes.splice( this.listPlanes.findIndex((u) => u.id == idPlan), 1 );
                
                            } else { this.alertService.error(responseDelete.responseMesagge); }
                    
                        }, (error) => { this.alertService.error(error); });

                } else { return; }
            });
    }

    private cantidadAdministradores(listUsers : User[]) : number {

        let cant : number = 0;

        for (let i = 0; i < listUsers.length; i++) { 
            if (listUsers[i].idRol && listUsers[i].idRol.match(this.adminBusinessUser)) cant++ ; 
        }
        return cant;
    }
}
