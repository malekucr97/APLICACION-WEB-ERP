import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User, Role, ResponseMessage, RoleBusiness } from '@app/_models';
import { Compania } from '../../_models/modules/compania';
import { httpAccessAdminPage } from '@environments/environment';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';

@Component({templateUrl: 'HTML_AddEditRolPage.html',
            styleUrls: [ '../../../assets/scss/app.scss', '../../../assets/scss/administrator/app.scss']
})
export class AddEditRolComponent extends OnSeguridad implements OnInit {
  rolForm: FormGroup;

  userObservable: User;
  businessObservable: Compania;

  response: ResponseMessage;
  
  loading : boolean = false;
  submitFormRol : boolean = false;

  role: Role = new Role();
  listRolesBusiness: Role[] = [];

  URLRedirectPage: string = httpAccessAdminPage.urlPageListRole;

  tituloBasePantalla: string = 'Formulario de Registro de Roles del Sistema';

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private alertService: AlertService ) {

        super(alertService, accountService, router);

        // ***************************************************************
        // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
        if (!super.userAuthenticateAdmin()) { this.accountService.logout(); return; }
        // ***************************************************************

        this.userObservable = this.accountService.userValue;
        this.businessObservable = this.accountService.businessValue;

        this.inicializaFormulario();
    }

    get f() { return this.rolForm.controls; }

    ngOnInit() { }

    inicializaFormulario() : void {
        this.rolForm = this.formBuilder.group({
            identificacionRol:  ['', Validators.required],
            nombreRol:          ['', Validators.required],
            rolEsAdministrador: [{value: 'No', disabled: true}, Validators.required],
            descripcionRol:     ['', Validators.required],
            estadoRol:          [{value: 'Activo', disabled: true}, Validators.required],
            tipoRol:            [{value: 'Escritura', disabled: true}, Validators.required]
        });
    }
    
    crateObjectForm() : Role {

        let rolForm: Role = new Role();

        rolForm.id = this.rolForm.get('identificacionRol').value;
        rolForm.nombre = this.rolForm.get('nombreRol').value;
        rolForm.esAdministrador = 0;
        rolForm.descripcion = this.rolForm.get('descripcionRol').value;
        rolForm.estado = this.rolForm.get('estadoRol').value;
        rolForm.tipo = this.rolForm.get('tipoRol').value;

        return rolForm;
    }

    crateObjectFormBusiness(rolForm: Role) : RoleBusiness {

        let rolFormBusiness: RoleBusiness = new RoleBusiness();

        rolFormBusiness.idRol = rolForm.id;
        rolFormBusiness.idCompania = this.businessObservable.id;

        rolFormBusiness.estado = rolForm.estado;
        rolFormBusiness.tipo = rolForm.tipo;

        return rolFormBusiness;
    }

    registrarRol() : void {

        this.alertService.clear();

        this.submitFormRol = true;
        this.loading = true;

        if (this.rolForm.invalid) return;

        let rolForm: Role = this.crateObjectForm();
        let rolFormBusiness: RoleBusiness = this.crateObjectFormBusiness(rolForm);

        this.accountService.addRol(rolForm, this._HIdUserSessionRequest, this._HBusinessSessionRequest)
            .pipe(first())
            .subscribe((responseAddRol) => {

                if (responseAddRol.exito) {

                    if (responseAddRol.objetoDb) this.asociarRolEmpresa(rolFormBusiness, responseAddRol.responseMesagge); 

                } else { this.alertService.error(responseAddRol.responseMesagge); }

                this.loading = false;
                this.submitFormRol = false;
            },
            (error) => {
                this.alertService.error(error);
                this.loading = false;
                this.submitFormRol = false;
            });
    }

    // ****************************************************
    // MÉTODOS PRIVADOS
    private asociarRolEmpresa(rolCreado: RoleBusiness, responseMessageAddRol : string) {

    this.accountService.assignRolBusiness(rolCreado, this._HIdUserSessionRequest, this._HBusinessSessionRequest)
        .pipe(first())
        .subscribe((response) => {

            if (response.exito) {
                this.alertService.success(responseMessageAddRol + ' ' + response.responseMesagge, { keepAfterRouteChange: true });
                this.router.navigate([this.URLRedirectPage], { relativeTo: this.route });
            
            } else { this.alertService.error(response.responseMesagge); }
        },
        (error) => { this.alertService.error(error); }
        );
    }
  // ****************************************************
}
