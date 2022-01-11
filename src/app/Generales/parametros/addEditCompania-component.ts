import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AccountService, AlertService, GeneralesService } from '@app/_services';
import { User, Module, Role, ResponseMessage } from '@app/_models';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { httpAccessPage } from '../../../environments/environment';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '../../_models/modules/compania';

@Component({
    templateUrl: 'HTML_AddEditCompania.html',
    styleUrls: ['../../../assets/scss/generales/app.scss'],
})
export class AddEditCompaniaComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;
    

    userObservable: User;
    moduleObservable: Module;
    companiaObservable: Compania;

    response: ResponseMessage;

    loading = false;
    submitted = false;

    id: string;

    esAdmin: boolean;

    listRolesBusiness: Role[] = [];

    compania = new Compania();;

    URLRedirectIndexContent: string;

    addEditForm: FormGroup;

    constructor (
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private generalesSerice: GeneralesService,
        private alertService: AlertService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.companiaObservable = this.accountService.businessValue;
    }

    ngOnInit() {
        this.URLRedirectIndexContent = httpAccessPage.urlContentIndex;

        // if(this.route.snapshot.params.exito){
        //     this.alertService.success(this.route.snapshot.params.message, { keepAfterRouteChange: true });
        // } else {
        //     this.alertService.error(this.route.snapshot.params.message, { keepAfterRouteChange: true });
        // }
        
        this.addEditForm = this.formBuilder.group({
            nombre: [this.companiaObservable.nombre, Validators.required],
            tipoIdentificacion: [this.companiaObservable.tipoIdentificacion, Validators.required],
            cedulaJuridica: [this.companiaObservable.cedulaJuridica, Validators.required],
            correoElectronico: [this.companiaObservable.correoElectronico, Validators.required],

            // <!-- INFORMACIÓN GEOGRÁFICA -->
            codigoPaisUbicacion: [this.companiaObservable.codigoPaisUbicacion, Validators.required],
            provincia: [this.companiaObservable.provincia, Validators.required],
            canton: [this.companiaObservable.canton, Validators.required],
            distrito: [this.companiaObservable.distrito, Validators.required],
            barrio: [this.companiaObservable.barrio],
            detalleDireccion: [this.companiaObservable.detalleDireccion, Validators.required],

            codigoTelefono: [this.companiaObservable.codigoTelefono, Validators.required],
            telefono: [this.companiaObservable.telefono, Validators.required],

            claveCorreo: [''],
            hostCorreo: [this.companiaObservable.hostCorreo, Validators.required],
            puertoCorreo: [this.companiaObservable.puertoCorreo, Validators.required]
        });
    }

    get f() { return this.addEditForm.controls; }

    addEditFormSubmit() : void {

        this.alertService.clear();

        this.submitted = true;

        let today = new Date();

        if (this.addEditForm.invalid) {
            return;
        }
        this.loading = true;

        let companiaForm = new Compania();

        companiaForm.id = this.companiaObservable.id;
        companiaForm.nombre = this.addEditForm.get('nombre').value;
        companiaForm.tipoIdentificacion = this.addEditForm.get('tipoIdentificacion').value;
        companiaForm.cedulaJuridica = this.addEditForm.get('cedulaJuridica').value;
        companiaForm.correoElectronico = this.addEditForm.get('correoElectronico').value;
        companiaForm.codigoPaisUbicacion = this.addEditForm.get('codigoPaisUbicacion').value;
        companiaForm.provincia = this.addEditForm.get('provincia').value;
        companiaForm.canton = this.addEditForm.get('canton').value;
        companiaForm.distrito = this.addEditForm.get('distrito').value;
        companiaForm.barrio = this.addEditForm.get('barrio').value;
        companiaForm.detalleDireccion = this.addEditForm.get('detalleDireccion').value;
        companiaForm.codigoTelefono = this.addEditForm.get('codigoTelefono').value;
        companiaForm.telefono = this.addEditForm.get('telefono').value;
        if(this.addEditForm.get('claveCorreo').value) {
            companiaForm.claveCorreo = this.addEditForm.get('claveCorreo').value;
        }
        companiaForm.hostCorreo = this.addEditForm.get('hostCorreo').value;
        companiaForm.puertoCorreo = this.addEditForm.get('puertoCorreo').value;

        companiaForm.modificadoPor = this.userObservable.identificacion;
        companiaForm.fechaModificacion = today;

        this.generalesSerice.putCompania(companiaForm)
        .pipe(first())
        .subscribe( responseAddCompania => {

            if (responseAddCompania.exito) {
                this.accountService.updateLocalCompania(companiaForm);
                this.alertService.success(responseAddCompania.responseMesagge, { keepAfterRouteChange: true });
            }else{
                this.alertService.error(responseAddCompania.responseMesagge, { keepAfterRouteChange: true });
            }
            this.loading = false;
        },
        error => { console.log(error); this.alertService.error(error); this.loading = false; });

    }

    refrescar() {
        window.location.reload();
    }
}
