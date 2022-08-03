import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AccountService, AlertService, GeneralesService } from '@app/_services';
import { User, Module, Role, ResponseMessage } from '@app/_models';
import { first } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '../../../_models/modules/compania';
import { Procedimientos } from '@environments/environment-access-admin';

@Component({
    templateUrl: 'HTML_ConfigurationCompania.html',
    styleUrls: ['../../../../assets/scss/generales/app.scss'],
})
export class ConfigurationCompaniaComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;
    
    userObservable: User;
    moduleObservable: Module;
    companiaObservable: Compania;

    companiaConfiguration: Compania;

    submitted = false;

    addEditForm: FormGroup;

    constructor ( 
            private formBuilder: FormBuilder,
            private accountService: AccountService, 
            private generalesSerice: GeneralesService, 
            private alertService: AlertService ) 
    {
        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.companiaObservable = this.accountService.businessValue;
    }

    ngOnInit() {

        this.companiaConfiguration = new Compania();

        this.addEditForm = this.formBuilder.group({
            id: [this.companiaObservable.id],
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
        
        this.companiaConfiguration = this.companiaObservable;
    }

    get f() { return this.addEditForm.controls; }

    updateSubmit() : void {

        let operationName : string = Procedimientos._actualizarInformacionCompania;
        let module : string = Procedimientos._MOD_GENERALES;
        let entityName : string = 'MOD_Compania';

        this.alertService.clear();
 
        this.submitted = true;

        var today = new Date();

        if (this.addEditForm.invalid)
            return;
        
        let companiaForm = new Compania();

        companiaForm.id = this.addEditForm.controls['id'].value;

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
        //companiaForm.fechaModificacion = today.toLocaleDateString();

        let adn = createObjectADNCompania(companiaForm, operationName, module, entityName);

        this.generalesSerice.putCompania(companiaForm)
        .pipe(first())
        .subscribe( responseAddCompania => {
            this.alertService.clear();

            if (responseAddCompania.exito) {
                this.accountService.updateLocalCompania(companiaForm);
                this.alertService.success(responseAddCompania.responseMesagge, { keepAfterRouteChange: true });
            }else{
                this.alertService.error(responseAddCompania.responseMesagge, { keepAfterRouteChange: true });
            }
        },
        error => { console.log(error); this.alertService.error(error); });
    }

    refrescar() {
        // window.location.reload();
    }
}

function createObjectADNCompania(companiaForm: Compania, operationName:string, module:string, entityName:string) : string {
    
    let req : string = `{
                    "OperationName":"${ operationName }",
                    "Module":"${ module }",
                    "ObjectToProcess":[{
                            "EntityName":"${entityName}",
                            "Attributes":[
                            {
                                "Name":"ID",
                                "Type":1,
                                "ObjectValue":"${companiaForm.id}"
                            },
                            {
                                "Name":"NOMBRE",
                                "Type":0,
                                "ObjectValue":"${companiaForm.nombre}"
                            },
                            {
                                "Name":"TIPO_IDENTIFICACION",
                                "Type":0,
                                "ObjectValue":"${companiaForm.tipoIdentificacion}"
                            },
                            {
                                "Name":"CEDULA_JURIDICA",
                                "Type":0,
                                "ObjectValue":"${companiaForm.cedulaJuridica}"
                            },
                            {
                                "Name":"DESCRIPCION_COMPANIA",
                                "Type":0,
                                "ObjectValue":"${companiaForm.descripcionCompania}"
                            },
                            {
                                "Name":"CORREO_ELECTRONICO",
                                "Type": 0,
                                "ObjectValue":"${companiaForm.correoElectronico}"
                            },
                            {
                                "Name":"CODIGO_PAIS",
                                "Type":0,
                                "ObjectValue":"${companiaForm.codigoPaisUbicacion}"
                            },
                            {
                                "Name":"PROVINCIA",
                                "Type":0,
                                "ObjectValue":"${companiaForm.provincia}"
                            },
                            {
                                "Name":"CANTON",
                                "Type":0,
                                "ObjectValue":"${companiaForm.canton}"
                            },
                            {
                                "Name":"DISTRITO",
                                "Type":0,
                                "ObjectValue":"${companiaForm.distrito}"
                            },
                            {
                                "Name":"BARRIO",
                                "Type":0,
                                "ObjectValue":"${companiaForm.barrio}"
                            },
                            {
                                "Name":"DETALLE_DIRECCION",
                                "Type":0,
                                "ObjectValue":"${companiaForm.detalleDireccion}"
                            },
                            {
                                "Name":"CODIGO_TELEFONO",
                                "Type":0,
                                "ObjectValue":"${companiaForm.codigoTelefono}"
                            },
                            {
                                "Name":"TELEFONO",
                                "Type":0,
                                "ObjectValue":"${companiaForm.telefono}"
                            },
                            {
                                "Name":"CLAVE_CORREO",
                                "Type":0,
                                "ObjectValue":"${companiaForm.claveCorreo}"
                            },
                            {
                                "Name":"HOST_CORREO",
                                "Type":0,
                                "ObjectValue":"${companiaForm.hostCorreo}"
                            },
                            {
                                "Name":"PUERTO_CORREO",
                                "Type":0,
                                "ObjectValue":"${companiaForm.puertoCorreo}"
                            },
                            {
                                "Name":"MODIFICADO_POR",
                                "Type":0,
                                "ObjectValue": "${companiaForm.modificadoPor}"
                            },
                            {
                                "Name":"FECHA_MODIFICACION",
                                "Type":2,
                                "ObjectValue":"${companiaForm.fechaModificacion}"
                            }]
                    }]
                }`;

                console.log(req);

                let obj = JSON.parse(req);
                
                return req;
            }