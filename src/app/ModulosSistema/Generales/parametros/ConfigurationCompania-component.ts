import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService, GeneralesService } from '@app/_services';
import { User, Module } from '@app/_models';
import { first } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '../../../_models/modules/compania';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { Router } from '@angular/router';
import { ModulesSystem } from '@environments/environment';

declare var $: any;

@Component({
    templateUrl: 'HTML_ConfigurationCompania.html',
    styleUrls: [
        '../../../../assets/scss/app.scss',
        '../../../../assets/scss/generales/app.scss'],
})
export class ConfigurationCompaniaComponent extends OnSeguridad implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla: string = 'ConfigurationCompania.html';
    tituloBasePantalla: string = 'Parametrización de la Compañía';

    URLIndexHomeGenerales: string = ModulesSystem.generalesbasehref + 'index.html';

    userObservable:     User;
    moduleObservable:   Module;
    companiaObservable: Compania;

    companiaSeleccionada: Compania;

    submitFormCompania = false;

    companiaForm: FormGroup;

    public today : Date ;

    constructor (   private formBuilder: FormBuilder,
                    private accountService: AccountService,
                    private generalesSerice: GeneralesService,
                    private alertService: AlertService,
                    private router: Router) {

        //#region VALIDACIÓN DE ACCESO A LAS PANTALLAS
        super(alertService, accountService, router);
        super._nombrePantalla = this.nombrePantalla;
        // super._redireccionURL = '/inra-sa'; // [OPCIONAL] SI NO SE INDICA SE REDIRECCIONA AL LA PÁGINA DEL MODULO.INDEXHTML
        super.validarAccesoPantalla();
        //#endregion

        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.companiaObservable = this.accountService.businessValue;

        this.iniciarFormulario(this.companiaObservable);

        this.today = new Date();
    }

    ngOnInit() { }

    get f() { return this.companiaForm.controls; }

    private iniciarFormulario(objetoCompania : Compania = null) {

        this.submitFormCompania = false;

        if (objetoCompania) {

            this.companiaSeleccionada = objetoCompania;

            this.companiaForm = this.formBuilder.group({
                idCompania:                     [this.companiaSeleccionada.id],
                nombreCompania:                 [this.companiaSeleccionada.nombre, Validators.required],
                tipoIdentificacionCompania:     [this.companiaSeleccionada.tipoIdentificacion, Validators.required],
                numeroIdentificacionCompania:   [this.companiaSeleccionada.cedulaJuridica, Validators.required],
                correoElectronicoCompania:      [this.companiaSeleccionada.correoElectronico, Validators.required],

                codigoPaisUbicacionCompania:    [this.companiaSeleccionada.codigoPaisUbicacion],
                provinciaCompania:              [this.companiaSeleccionada.provincia, Validators.required],
                cantonCompania:                 [this.companiaSeleccionada.canton, Validators.required],
                distritoCompania:               [this.companiaSeleccionada.distrito, Validators.required],
                barrioCompania:                 [this.companiaSeleccionada.barrio, Validators.required],
                detalleDireccionCompania:       [this.companiaSeleccionada.detalleDireccion, Validators.required],

                codigoTelefonoCompania: [this.companiaSeleccionada.codigoTelefono],
                telefonoCompania:       [this.companiaSeleccionada.telefono, Validators.required],

                claveCorreoCompania:    [null],
                hostCorreoCompania:                 [this.companiaSeleccionada.hostCorreo],
                puertoCorreoCompania:               [this.companiaSeleccionada.puertoCorreo],
                estadoSSLCompania:                  [this.companiaSeleccionada.estadoSSL],
                mantenimientoReportesCompania:      [this.companiaSeleccionada.mantenimientoReportes],
                tamanoModuloDefectoCompania:      [this.companiaSeleccionada.tamanoModuloDefecto],
                cuentaCorreoDefectoCompania:      [this.companiaSeleccionada.cuentaCorreoDefecto],

            });
        } else { this.companiaSeleccionada = null; }
    }

    crearObjectFormEncabezado() : Compania {

        let companiaForm = new Compania();

        companiaForm.id = this.companiaSeleccionada.id;
        companiaForm.nombre = this.companiaForm.get('nombreCompania').value;
        companiaForm.tipoIdentificacion = this.companiaForm.get('tipoIdentificacionCompania').value;
        companiaForm.cedulaJuridica = this.companiaForm.get('numeroIdentificacionCompania').value;
        companiaForm.correoElectronico = this.companiaForm.get('correoElectronicoCompania').value;

        companiaForm.codigoPaisUbicacion = this.companiaForm.get('codigoPaisUbicacionCompania').value;
        companiaForm.provincia = this.companiaForm.get('provinciaCompania').value;
        companiaForm.canton = this.companiaForm.get('cantonCompania').value;
        companiaForm.distrito = this.companiaForm.get('distritoCompania').value;
        companiaForm.barrio = this.companiaForm.get('barrioCompania').value;
        companiaForm.detalleDireccion = this.companiaForm.get('detalleDireccionCompania').value;
        companiaForm.codigoTelefono = this.companiaForm.get('codigoTelefonoCompania').value;
        companiaForm.telefono = this.companiaForm.get('telefonoCompania').value;

        if(this.companiaForm.get('claveCorreoCompania').value)
            companiaForm.claveCorreo = this.companiaForm.get('claveCorreoCompania').value;

        companiaForm.hostCorreo = this.companiaForm.get('hostCorreoCompania').value;
        companiaForm.puertoCorreo = this.companiaForm.get('puertoCorreoCompania').value;
        companiaForm.estadoSSL = this.companiaForm.get('estadoSSLCompania').value;
        companiaForm.mantenimientoReportes = this.companiaForm.get('mantenimientoReportesCompania').value;
        companiaForm.tamanoModuloDefecto = this.companiaForm.get('tamanoModuloDefectoCompania').value;
        companiaForm.cuentaCorreoDefecto = this.companiaForm.get('cuentaCorreoDefectoCompania').value;

        return companiaForm;
    }

    selectObjetoCompania() : void { this.iniciarFormulario(this.companiaSeleccionada); }

    UpdateCompania() : void {

        this.alertService.clear();

        this.submitFormCompania = true;

        if (this.companiaForm.invalid) return;

        let objectFormCompania = this.crearObjectFormEncabezado();

        objectFormCompania.modificadoPor        = this.userObservable.identificacion;
        objectFormCompania.fechaModificacion    = this.today;

        this.generalesSerice.putCompania(objectFormCompania)
            .pipe(first())
            .subscribe( response => {

                if (response.exito) {

                    this.companiaSeleccionada = objectFormCompania;
                    this.accountService.loadBusinessAsObservable(objectFormCompania);

                    this.iniciarFormulario(objectFormCompania);

                    this.alertService.success(response.responseMesagge);

                } else { this.alertService.error(response.responseMesagge); }
            },
            error => { this.alertService.error(error); });
    }
}

// function createObjectADNCompania(companiaForm: Compania, operationName:string, module:string, entityName:string) : string {

//     let req : string = `{
//                     "OperationName":"${ operationName }",
//                     "Module":"${ module }",
//                     "ObjectToProcess":[{
//                             "EntityName":"${entityName}",
//                             "Attributes":[
//                             {
//                                 "Name":"ID",
//                                 "Type":1,
//                                 "ObjectValue":"${companiaForm.id}"
//                             },
//                             {
//                                 "Name":"NOMBRE",
//                                 "Type":0,
//                                 "ObjectValue":"${companiaForm.nombre}"
//                             },
//                             {
//                                 "Name":"TIPO_IDENTIFICACION",
//                                 "Type":0,
//                                 "ObjectValue":"${companiaForm.tipoIdentificacion}"
//                             },
//                             {
//                                 "Name":"CEDULA_JURIDICA",
//                                 "Type":0,
//                                 "ObjectValue":"${companiaForm.cedulaJuridica}"
//                             },
//                             {
//                                 "Name":"DESCRIPCION_COMPANIA",
//                                 "Type":0,
//                                 "ObjectValue":"${companiaForm.descripcionCompania}"
//                             },
//                             {
//                                 "Name":"CORREO_ELECTRONICO",
//                                 "Type": 0,
//                                 "ObjectValue":"${companiaForm.correoElectronico}"
//                             },
//                             {
//                                 "Name":"CODIGO_PAIS",
//                                 "Type":0,
//                                 "ObjectValue":"${companiaForm.codigoPaisUbicacion}"
//                             },
//                             {
//                                 "Name":"PROVINCIA",
//                                 "Type":0,
//                                 "ObjectValue":"${companiaForm.provincia}"
//                             },
//                             {
//                                 "Name":"CANTON",
//                                 "Type":0,
//                                 "ObjectValue":"${companiaForm.canton}"
//                             },
//                             {
//                                 "Name":"DISTRITO",
//                                 "Type":0,
//                                 "ObjectValue":"${companiaForm.distrito}"
//                             },
//                             {
//                                 "Name":"BARRIO",
//                                 "Type":0,
//                                 "ObjectValue":"${companiaForm.barrio}"
//                             },
//                             {
//                                 "Name":"DETALLE_DIRECCION",
//                                 "Type":0,
//                                 "ObjectValue":"${companiaForm.detalleDireccion}"
//                             },
//                             {
//                                 "Name":"CODIGO_TELEFONO",
//                                 "Type":0,
//                                 "ObjectValue":"${companiaForm.codigoTelefono}"
//                             },
//                             {
//                                 "Name":"TELEFONO",
//                                 "Type":0,
//                                 "ObjectValue":"${companiaForm.telefono}"
//                             },
//                             {
//                                 "Name":"CLAVE_CORREO",
//                                 "Type":0,
//                                 "ObjectValue":"${companiaForm.claveCorreo}"
//                             },
//                             {
//                                 "Name":"HOST_CORREO",
//                                 "Type":0,
//                                 "ObjectValue":"${companiaForm.hostCorreo}"
//                             },
//                             {
//                                 "Name":"PUERTO_CORREO",
//                                 "Type":0,
//                                 "ObjectValue":"${companiaForm.puertoCorreo}"
//                             },
//                             {
//                                 "Name":"MODIFICADO_POR",
//                                 "Type":0,
//                                 "ObjectValue": "${companiaForm.modificadoPor}"
//                             },
//                             {
//                                 "Name":"FECHA_MODIFICACION",
//                                 "Type":2,
//                                 "ObjectValue":"${companiaForm.fechaModificacion}"
//                             }]
//                     }]
//                 }`;

//                 console.log(req);

//                 let obj = JSON.parse(req);

//                 return req;
// }
