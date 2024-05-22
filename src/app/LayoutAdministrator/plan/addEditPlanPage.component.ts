import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User, ResponseMessage } from '@app/_models';
import { Compania } from '../../_models/modules/compania';
import { httpAccessAdminPage } from '@environments/environment';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';
import { AdminPlan, AdminPlanSupport, AdminTipoPlan } from '@app/_models/admin/planes/plan';

@Component({
  templateUrl: 'HTML_AddEditPlanPage.html',
  styleUrls: [ '../../../assets/scss/app.scss', '../../../assets/scss/administrator/app.scss']
})
export class AddEditPlanComponent extends OnSeguridad implements OnInit {
  
    planForm: FormGroup;
    response: ResponseMessage;
    pidPlanUpdate: number;
    planSeleccionado: AdminPlan;
    userObservable: User; businessObservable: Compania;
    submitFormPlan: boolean; updatePlan: boolean; addPlan: boolean;
    URLListPlanPage: string;

    public listTiposPlanes : AdminTipoPlan[];
    public listPlanesSupport : AdminPlanSupport[];
  
    constructor(private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private accountService: AccountService,
                private alertService: AlertService,
                private translate: TranslateMessagesService ) {

        super(alertService, accountService, router, translate);

        // ***************************************************************
        // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
        if (!super.userAuthenticateIndexHttp()) { this.accountService.logout(); return; }
        if (!super.validarUsuarioAdmin()) { this.accountService.logout(); return; }
        // ***************************************************************

        // **
        // ** INICIALIZACIÓN DE VARIABLES
        this.URLListPlanPage = httpAccessAdminPage.urlPageListPlan;

        this.updatePlan = false; this.addPlan = false; this.submitFormPlan = false;

        this.planSeleccionado = new AdminPlan('','',0,0,0,0,false,false,'',null);

        // ## -- listas
        this.listTiposPlanes = [{id: 1, nombre:'Software as a Service'},{id: 2, nombre:'On Premise'}];
        this.listPlanesSupport = [{id: 1, nombre:'Sí'},{id: 2, nombre:'No'}];

        this.userObservable = this.accountService.userValue; this.businessObservable = this.accountService.businessValue;

        // **

        this.inicializaFormulario();
    }

    get f() { return this.planForm.controls; }

    ngOnInit() {

        if (this.route.snapshot.params.pidPlan) {

            this.updatePlan = true;
            this.pidPlanUpdate = this.route.snapshot.params.pidPlan;

            this.accountService.getPlanById(this.pidPlanUpdate,
                                            this._HIdUserSessionRequest,
                                            this._HBusinessSessionRequest)
            .pipe(first())
            .subscribe((responsePlan) => { if (responsePlan) this.inicializaFormularioUpdatePlan(responsePlan); });
        // **
        // ** INICIALIZA REGISTRO DE NUEVO USUARIO
        } else { this.planSeleccionado = null; this.addPlan = true; this.inicializaFormularioAddPlan(); }
    }

    // **
    // ** PROCEDIMIENTOS HTML

    public actualizarPlan() : void {

        this.alertService.clear(); this.submitFormPlan = true;

        if (this.planForm.invalid) return;

        let planForm: AdminPlan = this.crateObjectForm(); 
        planForm.id = this.planSeleccionado.id;
        planForm.modificadoPor = this.userObservable.id.toString(); 
        planForm.fechaModificacion = new Date();

        this.accountService.updatePlan( planForm, 
                                        this._HIdUserSessionRequest,
                                        this._HBusinessSessionRequest )
            .pipe(first())
            .subscribe((responseUpdate) => {

              if (responseUpdate.exito) {

                this.alertService.success(responseUpdate.responseMesagge);
                this.planSeleccionado = responseUpdate.objetoDb;
                this.inicializaFormularioUpdatePlan(this.planSeleccionado);

              } else { this.alertService.error(responseUpdate.responseMesagge); }
                
            }, (error) => { this.alertService.error(error); this.submitFormPlan = false; });
    }

    public registrarPlan() : void {

        this.alertService.clear(); this.submitFormPlan = true;

        if (this.planForm.invalid) return;

        let planForm: AdminPlan = this.crateObjectForm();

        this.accountService.addPlan(planForm,
                                    this._HIdUserSessionRequest,
                                    this._HBusinessSessionRequest)
            .pipe(first())
            .subscribe((responseAddPlan) => {

                if (responseAddPlan.exito) {

                    this.alertService.success(responseAddPlan.responseMesagge, { keepAfterRouteChange:true });
                    this.router.navigate([this.URLListPlanPage], { relativeTo: this.route });

                } else { this.alertService.error(responseAddPlan.responseMesagge, { keepAfterRouteChange:true }); }

            }, (error) => { this.alertService.error(error); this.submitFormPlan=false; });
    }

    public selectObjetoPlan() : void { this.inicializaFormularioUpdatePlan(this.planSeleccionado); }
    // **

    // ****************************************************
    // MÉTODOS PRIVADOS
    private inicializaFormulario() : void {
        this.planForm = this.formBuilder.group({nombrePlan: [''],
                                                tipoPlan: [''],
                                                maxAdmin: [''],
                                                maxFuncional: [''],
                                                precioMensual: [''],
                                                precioAnual: [''],
                                                supportPlan: [''],
                                                porcentajeSoporte: ['']});
    }
    private inicializaFormularioUpdatePlan(planUpdate : AdminPlan = null) : void {

        if (planUpdate) {

            let soporte:number = 1; if(planUpdate.soporte === false) soporte = 2;

            this.planForm = this.formBuilder.group({nombrePlan: [planUpdate.nombre, Validators.required],
                                                    tipoPlan: [this.listTiposPlanes.find( x => x.nombre === planUpdate.tipo )],
                                                    maxAdmin: [planUpdate.maximoAdministradores, Validators.required],
                                                    maxFuncional: [planUpdate.maximoFuncionales, Validators.required],
                                                    precioMensual: [planUpdate.precioMensual, Validators.required],
                                                    precioAnual: [planUpdate.precioAnual, Validators.required],
                                                    supportPlan: [this.listPlanesSupport.find( x => x.id === soporte ), Validators.required],
                                                    porcentajeSoporte: [planUpdate.porcentajeSoporteXUsuario, Validators.required] });
            this.planSeleccionado = planUpdate;
        }
    }
    private inicializaFormularioAddPlan() : void {
        this.planForm = this.formBuilder.group({nombrePlan: ['', Validators.required],
                                                tipoPlan: [this.listTiposPlanes.find( x => x.id === 1 ), Validators.required],
                                                maxAdmin: ['', Validators.required],
                                                maxFuncional: ['', Validators.required],
                                                precioMensual: ['', Validators.required],
                                                precioAnual: ['', Validators.required],
                                                supportPlan: [this.listPlanesSupport.find( x => x.id === 1 ), Validators.required],
                                                porcentajeSoporte: ['', Validators.required] });
    }
    private crateObjectForm() : AdminPlan {

        let soporte:boolean = false;
        let soporteform = this.planForm.get('supportPlan').value.id; if(soporteform === 1) soporte = true;

        let fechaRegistro : Date = new Date();

        let planForm: AdminPlan = new AdminPlan(this.planForm.get('nombrePlan').value,
                                                this.planForm.get('tipoPlan').value.nombre,
                                                this.planForm.get('maxAdmin').value,
                                                this.planForm.get('maxFuncional').value,
                                                this.planForm.get('precioMensual').value,
                                                this.planForm.get('precioAnual').value,
                                                soporte,
                                                this.planForm.get('porcentajeSoporte').value,
                                                this.userObservable.id.toString(),
                                                fechaRegistro);
        return planForm;
    }
  // ****************************************************
}
