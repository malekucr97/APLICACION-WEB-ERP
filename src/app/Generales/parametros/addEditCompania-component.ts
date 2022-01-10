import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService, GeneralesService } from '@app/_services';
import { User, Module, Role, ResponseMessage } from '@app/_models';
import { first } from 'rxjs/operators';
import { httpAccessPage } from '../../../environments/environment';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '../../_models/modules/compania';

@Component({
    templateUrl: 'HTML_AddEditCompania.html',
    styleUrls: ['../../../assets/scss/generales/app.scss'],
})
export class AddEditCompaniaComponent implements OnInit {
    @ViewChild(MatSidenav)
    sidenav !: MatSidenav;

    userObservable: User;
    moduleObservable: Module;
    companiaObservable: Compania;

    response: ResponseMessage;

    loading = false;
    submitted = false;

    id: string;

    esAdmin: boolean;
    updateCompania: boolean;
    addCompania: boolean;

    listRolesBusiness: Role[] = [];

    compania = new Compania();;

    URLRedirectIndexContent: string;

    addEditForm: FormGroup;

    constructor (
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private generalesSerice: GeneralesService,
        private alertService: AlertService
    ) {
        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.companiaObservable = this.accountService.businessValue; 
    }

    ngOnInit() {
        this.URLRedirectIndexContent = httpAccessPage.urlContentIndex;
        // 
        this.updateCompania, this.addCompania  = false;

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

            claveCorreo: [this.companiaObservable.claveCorreo, Validators.required],
            hostCorreo: [this.companiaObservable.hostCorreo, Validators.required],
            puertoCorreo: [this.companiaObservable.puertoCorreo, Validators.required]
        });
    }

    get f() { return this.addEditForm.controls; }

    actualizarInformacion(){

    }

    addEditFormSubmit() : void {

        this.submitted = true;
        this.alertService.clear();

        if (this.addEditForm.invalid) {
            return;
        }
        this.loading = true;

        let companiaForm = new Compania();

        companiaForm.tipoIdentificacion = this.addEditForm.get('tipoIdentificacion').value;
        companiaForm.correoElectronico = this.addEditForm.get('correoElectronico').value;
        companiaForm.codigoPaisUbicacion = this.addEditForm.get('codigoPaisUbicacion').value;
        companiaForm.provincia = this.addEditForm.get('provincia').value;
        companiaForm.canton = this.addEditForm.get('canton').value;
        companiaForm.distrito = this.addEditForm.get('distrito').value;
        companiaForm.barrio = this.addEditForm.get('barrio').value;
        companiaForm.detalleDireccion = this.addEditForm.get('detalleDireccion').value;
        companiaForm.codigoTelefono = this.addEditForm.get('codigoTelefono').value;
        companiaForm.telefono = this.addEditForm.get('telefono').value;
        companiaForm.claveCorreo = this.addEditForm.get('claveCorreo').value;
        companiaForm.hostCorreo = this.addEditForm.get('hostCorreo').value;
        companiaForm.puertoCorreo = this.addEditForm.get('puertoCorreo').value;

        if (this.addCompania) {

            companiaForm.adicionadoPor = this.userObservable.identificacion;
            companiaForm.fechaAdicion = this.generalesSerice.obtenerFechaActual();

            this.generalesSerice.postRegistrarCompania(companiaForm)
            .pipe(first())
            .subscribe( responseAddCompania => {

                if (responseAddCompania.exito) {

                    window.location.reload();
                    this.alertService.success(responseAddCompania.responseMesagge, { keepAfterRouteChange: true });
                }else{
                    this.alertService.error(responseAddCompania.responseMesagge, { keepAfterRouteChange: true });
                }
                this.loading = false;
            },
            error => { console.log(error); this.alertService.error(error); this.loading = false; });
        }

        // if (this.updateCompania) {

        //     companiaForm.modificadoPor = this.userObservable.identificacion;
        //     companiaForm.fechaModificacion = this.generalesSerice.obtenerFechaActual();

            // this.accountService.updateCompania(this.id, this.companiaForm)
            // .pipe(first())
            // .subscribe(
            //     response => {
            //         this.router.navigate([this.URLRedirectIndexContent], { relativeTo: this.route });
            //         this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
            //         this.loading = false;
            //     },
            //     error => { console.log(error); this.alertService.error(error); this.loading = false; });
        // }
    }
}
