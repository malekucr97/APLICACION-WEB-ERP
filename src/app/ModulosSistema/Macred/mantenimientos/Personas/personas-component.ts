// import { UntypedFormBuilder, UntypedFormGroup, Validators  } from '@angular/forms';
// import { Component, OnInit, ViewChild } from '@angular/core';
// import { AccountService, AlertService } from '@app/_services';
// import { User, Module } from '@app/_models';
// import { MatSidenav } from '@angular/material/sidenav';
// import { Compania } from '../../../../_models/modules/compania';
// import { MacredService } from '@app/_services/macred.service';
// import { Router } from '@angular/router';
// import { first } from 'rxjs/operators';
// import { MacPersona } from '@app/_models/Macred/Persona';
// import { MatDialog } from '@angular/material/dialog';
// import { MacEstadoCivil } from '@app/_models/Macred/EstadoCivil';
// import { MacTipoPersona } from '@app/_models/Macred/TipoPersona';
// import { MacTipoGenero } from '@app/_models/Macred/TipoGenero';
// import { MacCondicionLaboral } from '@app/_models/Macred/CondicionLaboral';
// import { MacCategoriaCredito } from '@app/_models/Macred/CategoriaCredito';
// import { MacTipoAsociado } from '@app/_models/Macred/TipoAsociado';
// import { MacTipoHabitacion } from '@app/_models/Macred/TipoHabitacion';

// declare var $: any;

// @Component({selector: 'app-personas-macred',
//             templateUrl: 'HTML_Personas.html',
//             styleUrls: ['../../../../../assets/scss/app.scss', '../../../../../assets/scss/macred/app.scss'],
//             standalone: false
// })
// export class PersonasComponent implements OnInit {
//     @ViewChild(MatSidenav) sidenav !: MatSidenav;

//     nombrePantalla : string = 'datos-personas.html';

//     _globalCodMonedaPrincipal : number ;
//     _personaMacred : MacPersona;

//     userObservable: User;
//     moduleObservable: Module;
//     companiaObservable: Compania;

//     submittedPersonForm : boolean = false;

//     // Personas
//     formPersona: UntypedFormGroup;
//     formPersonaCredit: UntypedFormGroup;
    
//     listPersonas: MacPersona[];
//     showList : boolean = false;

//     listEstadosCiviles: MacEstadoCivil[];
//     listTiposPersonas: MacTipoPersona[];
//     listTiposGeneros: MacTipoGenero[];
//     listCondicionesLaborales: MacCondicionLaboral[];
//     listCategoriasCreditos: MacCategoriaCredito[];
//     listTiposAsociados: MacTipoAsociado[];
//     listTiposHabitaciones: MacTipoHabitacion[];

//     submitted : boolean = false;
//     update : boolean = false;
//     add : boolean = false;
//     delete : boolean = false;

//     buttomText : string = '';

//     public today = new Date();

//     tipoActualizacion : string; // P - Persona, C - Info Credito, N - Nuevo registro

//     constructor (private formBuilder: UntypedFormBuilder,
//                  private macredService: MacredService,
//                  private accountService: AccountService,
//                  private alertService: AlertService,
//                  private router: Router,
//                  public dialogo: MatDialog) {
//         this.userObservable = this.accountService.userValue;
//         this.moduleObservable = this.accountService.moduleValue;
//         this.companiaObservable = this.accountService.businessValue;
//     }

//     ngOnInit() {

//         this.accountService.validateAccessUser( this.userObservable.id,
//                                                 this.moduleObservable.id,
//                                                 this.nombrePantalla,
//                                                 this.companiaObservable.id )
//             .pipe(first())
//             .subscribe(response => {

//                 // ## -->> redirecciona NO ACCESO
//                 if(!response.exito) this.router.navigate([this.moduleObservable.indexHTTP]);

//                 this.inicializaFormularios();

//                 this.consultaPersonasCompania();

//                 this.macredService.GetParametroGeneralVal1(this.companiaObservable.id, 'COD_MONEDA_PRINCIPAL', true)
//                     .pipe(first())
//                     .subscribe(response => { this._globalCodMonedaPrincipal = +response; });

//             });
//     }

//     get f() { return this.formPersona.controls; }
//     get c() { return this.formPersonaCredit.controls; }

//     consultaPersonasCompania() : void {

//         this.macredService.getPersonasCompania(this.userObservable.empresa)
//             .pipe(first())
//             .subscribe(personaResponse => {

//                 if (personaResponse.length > 0) {
//                     this.showList = true;
//                     this.listPersonas = personaResponse;
//                 }
//             }, error => { this.alertService.error('Problemas al consultar las personas. ' + error); });
//     }

//     consultaEstadosCivilesCompania() : void {

//         this.macredService.getEstadosCiviles()
//         .pipe(first())
//         .subscribe(estadoCivilResponse => {

//             if (estadoCivilResponse.length > 0) {
//                 this.showList = true;
//                 this.listEstadosCiviles = estadoCivilResponse;
//             }
//         }, error => { this.alertService.error('Problemas al consultar los estados civiles. ' + error); });
//     }

//     consultaTiposPersonasCompania() : void {

//         this.macredService.getTiposPersonasCompania(this.userObservable.empresa)
//         .pipe(first())
//         .subscribe(tipoPersonaResponse => {

//             if (tipoPersonaResponse.length > 0) {
//                 this.showList = true;
//                 this.listTiposPersonas = tipoPersonaResponse;
//             }
//         }, error => { this.alertService.error('Problemas al consultar los tipos de personas. ' + error); });
//     }

//     consultaTiposGenerosCompania() : void {

//         this.macredService.getTiposGenerosCompania(this.userObservable.empresa)
//         .pipe(first())
//         .subscribe(tipoGeneroResponse => {

//             if (tipoGeneroResponse.length > 0) {
//                 this.showList = true;
//                 this.listTiposGeneros = tipoGeneroResponse;
//             }
//         }, error => { this.alertService.error('Problemas al consultar los tipos de generos. ' + error); });
//     }

//     consultaCondicionesLaboralesCompania() : void {

//         this.macredService.getCondicionesLaboralesCompania(this.userObservable.empresa)
//         .pipe(first())
//         .subscribe(condicionLaboralResponse => {

//             if (condicionLaboralResponse.length > 0) {
//                 this.showList = true;
//                 this.listCondicionesLaborales = condicionLaboralResponse;
//             }
//         }, error => { this.alertService.error('Problemas al consultar las condiciones laborales. ' + error); });
//     }

//     consultaCategoriasCreditosCompania() : void {

//         this.macredService.getCategoriasCreditosCompania(this.userObservable.empresa)
//         .pipe(first())
//         .subscribe(categoriaCreditoResponse => {

//             if (categoriaCreditoResponse.length > 0) {
//                 this.showList = true;
//                 this.listCategoriasCreditos = categoriaCreditoResponse;
//             }
//         }, error => { this.alertService.error('Problemas al consultar las categorias de créditos. ' + error); });
//     }

//     consultaTiposAsociadoCompania() : void {

//         this.macredService.getTiposAsociadosCompania(this.userObservable.empresa)
//         .pipe(first())
//         .subscribe(tipoAsociadoResponse => {

//             if (tipoAsociadoResponse.length > 0) {
//                 this.showList = true;
//                 this.listTiposAsociados = tipoAsociadoResponse;
//             }
//         }, error => { this.alertService.error('Problemas al consultar los tipos de asociados. ' + error); });
//     }

//     consultaTiposHabitacionesCompania() : void {

//         this.macredService.getTiposHabitacionesCompania(this.userObservable.empresa)
//         .pipe(first())
//         .subscribe(tipoHabitacionResponse => {

//             if (tipoHabitacionResponse.length > 0) {
//                 this.showList = true;
//                 this.listTiposHabitaciones = tipoHabitacionResponse;
//             }
//         }, error => { this.alertService.error('Problemas al consultar los tipos de habitaciones. ' + error); });
//     }

//     editPersonaModal(persona:MacPersona) : void {

//         this.update = true;
//         this.buttomText = 'Actualizar';
//         this.tipoActualizacion = 'P';

//         this.consultaEstadosCivilesCompania();
//         this.consultaTiposPersonasCompania();
//         this.consultaTiposGenerosCompania();
//         this.consultaCondicionesLaboralesCompania();
//         this.consultaTiposHabitacionesCompania();

//         this._personaMacred = persona;

//         this.formPersona = this.formBuilder.group({
//             identificacionPersona: [persona.identificacion, Validators.required],
//             nombrePersona: [persona.nombre, Validators.required],
//             primerApellidoPersona: [persona.primerApellido, Validators.required],
//             segundoApellidoPersona: [persona.segundoApellido, Validators.required],
//             estadoCivilPersona : [persona.codigoEstadoCivil, Validators.required],
//             codigoTipoPersona : [persona.codigoTipoPersona, Validators.required],
//             codigoGeneroPersona : [persona.codigoGenero, Validators.required],
//             codigoCondicionLaboralPersona : [persona.codigoCondicionLaboral, Validators.required],
//             codigoTipoHabitacionPersona : [persona.codigoTipoHabitacion, Validators.required],
//             cantidadHijosPersona : [persona.cantidadHijos, Validators.required],
//             fechaNacimientoPersona: [persona.fechaNacimiento, Validators.required],
//             estadoPersona : [persona.estado],
//             indAsociadoPersona : [persona.indAsociado]
//         });

//         $('#personaModal').modal({backdrop: 'static', keyboard: false}, 'show');
//     }

//     editInformacionCrediticiaModal(persona:MacPersona) : void {

//         this.update = true;
//         this.buttomText = 'Actualizar';
//         this.tipoActualizacion = 'C';

//         this.consultaCategoriasCreditosCompania();
//         this.consultaTiposAsociadoCompania();

//         this._personaMacred = persona;

//         this.formPersonaCredit = this.formBuilder.group({
//             identificacion  : [persona.identificacion, Validators.required],
//             nombre          : [persona.nombre, Validators.required],
//             primerApellido  : [persona.primerApellido, Validators.required],
//             segundoApellido : [persona.segundoApellido, Validators.required],
//             // Información Crediticia
//             cantidadFianzas : [persona.cantidadFianzas],
//             tiempoAfiliacion : [persona.tiempoAfiliacion],
//             cantidadCreditosHistorico : [persona.cantidadCreditosHistorico],
//             totalSaldoFianzas : [persona.totalSaldoFianzas],
//             totalCuotasFianzas : [persona.totalCuotasFianzas],
//             cPH : [persona.cph],
//             cPHUltimos12Meses : [persona.cphUltimos12Meses],
//             cPHUltimos24Meses : [persona.cphUltimos24Meses],
//             atrasoMaximo : [persona.atrasoMaximo],
//             atrasosUltimos12Meses : [persona.atrasosUltimos12Meses],
//             atrasosUltimos24Meses : [persona.atrasosUltimos24Meses],
//             diasAtrasoCorte : [persona.diasAtrasoCorte],
//             codigoCategoriaCredito : [persona.codigoCategoriaCredito],
//             codigoTipoAsociado : [persona.codigoTipoAsociado]
//         });

//         $('#infoCreiditiciaModal').modal({backdrop: 'static', keyboard: false}, 'show');
//     }

//     addPersona() : void {
//         this.alertService.clear();
//         this.ngOnInit();
//         this.add = true;
//         this.tipoActualizacion = 'N'

//         this.consultaEstadosCivilesCompania();
//         this.consultaTiposPersonasCompania();
//         this.consultaTiposGenerosCompania();
//         this.consultaCondicionesLaboralesCompania();
//         this.consultaTiposHabitacionesCompania();

//         $('#personaModal').modal({backdrop: 'static', keyboard: false}, 'show');
//     }

//     deletePersona(idPersona:number){

//         this.macredService.deletePersona(idPersona)
//             .pipe(first())
//             .subscribe(response => {

//                 if (response) {
//                     this.alertService.success( `Persona eliminada correctamente!` );
//                     this.ngOnInit();

//                 } else { this.alertService.error('Problemas al eliminar la persona.'); }
            
//             }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error); });
//     }

//     guardarPersona() : void {

//         var persona : MacPersona;
//         let esFormPersona : boolean = false;

//         this.alertService.clear();

//         if (this.tipoActualizacion == 'P' || this.tipoActualizacion == 'N') esFormPersona = true;
        
//         if (esFormPersona) { 
//             if ( this.formPersona.invalid ) return;

//         } else { 
//             if ( this.formPersonaCredit.invalid ) return; 
//         }

//         // nuevo registro
//         if (this.tipoActualizacion == 'N') {

//             persona = this.createPersonaForm();
//             persona.codigoCompania = this.userObservable.empresa;
//             persona.adicionadoPor = this.userObservable.identificacion;
//             persona.fechaAdicion = this.today;

//             this.macredService.postPersona(persona)
//             .pipe(first())
//             .subscribe(response => {

//                 if (response) {

//                     this._personaMacred = response;

//                     this.alertService.success(
//                         `Persona ${ this._personaMacred.identificacion } guardado correctamente!`
//                     );
//                     $('#personaModal').modal('hide');
//                     this.ngOnInit();

//                 } else { this.alertService.error('Problemas al registrar la persona.'); }
//             },
//             error => { this.alertService.error('Problemas de conexión. Detalle: ' + error); });

//         } else {

//             if (esFormPersona) { 
//                 persona = this.updatePersonaModal();
//             } else { 
//                 persona = this.updateCreditoModal();
//             }

//             persona.modificadoPor      = this.userObservable.identificacion;
//             persona.fechaModificacion  = this.today;

//             this.macredService.putPersona(persona)
//             .pipe(first())
//             .subscribe(response => {

//                 if (response) {

//                     this._personaMacred = response;

//                     this.alertService.success(
//                         `Persona ${this._personaMacred.identificacion} actualizada correctamente!`
//                     );

//                     if (esFormPersona) { 
//                         $('#personaModal').modal('hide');
//                     } else { 
//                         $('#infoCreiditiciaModal').modal('hide');
//                     }

//                     this.ngOnInit();

//                 } else { this.alertService.error('Problemas al actualizar la persona.'); }
            
//             }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error); });
//         }
//     }

//     createPersonaForm() : MacPersona {

//         var identificacion = this.formPersona.controls['identificacionPersona'].value;
//         var nombre = this.formPersona.controls['nombrePersona'].value;
//         var primerApellido = this.formPersona.controls['primerApellidoPersona'].value;
//         var segundoApellido = this.formPersona.controls['segundoApellidoPersona'].value;
//         var estadoCivil = this.formPersona.controls['estadoCivilPersona'].value;
//         var codigoTipoPersona = this.formPersona.controls['codigoTipoPersona'].value;
//         var codigoGenero = this.formPersona.controls['codigoGeneroPersona'].value;
//         var condicionLaboral = this.formPersona.controls['codigoCondicionLaboralPersona'].value;
//         var cantidadHijos = this.formPersona.controls['cantidadHijosPersona'].value;
//         var fechaNacimiento = this.formPersona.controls['fechaNacimientoPersona'].value;
//         var codigoTipoHabitacion = this.formPersona.controls['codigoTipoHabitacionPersona'].value;
//         var estado = this.formPersona.controls['estadoPersona'].value;
//         var indicaAsociado = this.formPersona.controls['indAsociadoPersona'].value;

//         var edad = 0;
//         var datoProvincia = 0;
//         var perMediosPago = 0;
//         var perSegmentoAsociado = 0;
//         var perMontoAprobado = 0;
//         var perEndeudamientoTotal = 0;
//         var perAnioAfiliacion = 0;
//         var codigoCategoriaCredito = 1;

//         var persona = new MacPersona();

//         //persona.codigoCompania = codigoCompania;
//         persona.identificacion = identificacion;
//         persona.nombre = nombre;
//         persona.primerApellido = primerApellido;
//         persona.segundoApellido = segundoApellido;
//         persona.codigoEstadoCivil = estadoCivil;
//         persona.codigoTipoPersona = codigoTipoPersona;
//         persona.codigoGenero = codigoGenero;
//         persona.codigoCondicionLaboral = condicionLaboral;
//         persona.cantidadHijos = cantidadHijos;
//         persona.fechaNacimiento = fechaNacimiento;
//         persona.codigoTipoHabitacion = codigoTipoHabitacion;
//         persona.estado = estado;

//         persona.indAsociado = indicaAsociado;
//         persona.edad = edad;
//         persona.codigoTipoHabitacion = codigoTipoHabitacion;
//         persona.datoProvincia = datoProvincia;
//         persona.perMediosPago = perMediosPago;
//         persona.perSegmentoAsociado = perSegmentoAsociado;
//         persona.perMontoAprobado = perMontoAprobado;
//         persona.perEndeudamientoTotal = perEndeudamientoTotal;
//         persona.perAnioAfiliacion = perAnioAfiliacion;
//         persona.codigoCategoriaCredito = codigoCategoriaCredito;

//         return persona;
//     }

//     updatePersonaModal() : MacPersona {

//         var identificacion = this.formPersona.controls['identificacionPersona'].value;
//         var nombre = this.formPersona.controls['nombrePersona'].value;
//         var primerApellido = this.formPersona.controls['primerApellidoPersona'].value;
//         var segundoApellido = this.formPersona.controls['segundoApellidoPersona'].value;
//         var estadoCivil = this.formPersona.controls['estadoCivilPersona'].value;
//         var codigoTipoPersona = this.formPersona.controls['codigoTipoPersona'].value;
//         var codigoGenero = this.formPersona.controls['codigoGeneroPersona'].value;
//         var condicionLaboral = this.formPersona.controls['codigoCondicionLaboralPersona'].value;
//         var cantidadHijos = this.formPersona.controls['cantidadHijosPersona'].value;
//         var fechaNacimiento = this.formPersona.controls['fechaNacimientoPersona'].value;
//         var codigoTipoHabitacion = this.formPersona.controls['codigoTipoHabitacionPersona'].value;
//         var estado = this.formPersona.controls['estadoPersona'].value;
//         var indicaAsociado = this.formPersona.controls['indAsociadoPersona'].value;

//         var persona = this._personaMacred;

//         persona.identificacion = identificacion;
//         persona.nombre = nombre;
//         persona.primerApellido = primerApellido;
//         persona.segundoApellido = segundoApellido;
//         persona.codigoEstadoCivil = estadoCivil;
//         persona.codigoTipoPersona = codigoTipoPersona;
//         persona.codigoGenero = codigoGenero;
//         persona.codigoCondicionLaboral = condicionLaboral;
//         persona.cantidadHijos = cantidadHijos;
//         persona.fechaNacimiento = fechaNacimiento;
//         persona.codigoTipoHabitacion = codigoTipoHabitacion;
//         persona.estado = estado;
//         persona.indAsociado = indicaAsociado;

//         return persona;
//     }

//     updateCreditoModal() : MacPersona {

//         var persona : MacPersona = new MacPersona;

//         persona.id = this._personaMacred.id;
//         persona.codigoEstadoCivil = this._personaMacred.codigoEstadoCivil;
//         persona.codigoTipoPersona = this._personaMacred.codigoTipoPersona;
//         persona.codigoGenero = this._personaMacred.codigoGenero;
//         persona.codigoCondicionLaboral = this._personaMacred.codigoCondicionLaboral;
//         persona.cantidadHijos = this._personaMacred.cantidadHijos;
//         persona.fechaNacimiento = this._personaMacred.fechaNacimiento;
//         persona.codigoTipoHabitacion = this._personaMacred.codigoTipoHabitacion;
//         persona.estado = this._personaMacred.estado;
//         persona.indAsociado = this._personaMacred.indAsociado;
        
//         persona.identificacion = this.formPersonaCredit.controls['identificacion'].value;
//         persona.nombre = this.formPersonaCredit.controls['nombre'].value;
//         persona.primerApellido = this.formPersonaCredit.controls['primerApellido'].value;
//         persona.segundoApellido = this.formPersonaCredit.controls['segundoApellido'].value;

//         persona.cantidadFianzas = this.formPersonaCredit.controls['cantidadFianzas'].value;
//         persona.tiempoAfiliacion = this.formPersonaCredit.controls['tiempoAfiliacion'].value;
//         persona.cantidadCreditosHistorico = this.formPersonaCredit.controls['cantidadCreditosHistorico'].value;
//         persona.totalSaldoFianzas = this.formPersonaCredit.controls['totalSaldoFianzas'].value;
//         persona.totalCuotasFianzas = this.formPersonaCredit.controls['totalCuotasFianzas'].value;
//         persona.cph = this.formPersonaCredit.controls['cPH'].value;
//         persona.cphUltimos12Meses = this.formPersonaCredit.controls['cPHUltimos12Meses'].value;
//         persona.cphUltimos24Meses = this.formPersonaCredit.controls['cPHUltimos24Meses'].value;
//         persona.atrasoMaximo = this.formPersonaCredit.controls['atrasoMaximo'].value;
//         persona.atrasosUltimos12Meses = this.formPersonaCredit.controls['atrasosUltimos12Meses'].value;
//         persona.atrasosUltimos24Meses = this.formPersonaCredit.controls['atrasosUltimos24Meses'].value;
//         persona.diasAtrasoCorte = this.formPersonaCredit.controls['diasAtrasoCorte'].value;
//         persona.codigoCategoriaCredito = this.formPersonaCredit.controls['codigoCategoriaCredito'].value;
//         persona.codigoTipoAsociado = this.formPersonaCredit.controls['codigoTipoAsociado'].value;

//         return persona;
//     }

//     private inicializaFormularios() : void {
//         this.formPersonaCredit = this.formBuilder.group({
//             identificacion : [null, Validators.required],
//             nombre : [null],
//             primerApellido : [null],
//             segundoApellido : [null],
//             cantidadFianzas : [null],
//             tiempoAfiliacion : [null],
//             cantidadCreditosHistorico : [null],
//             totalSaldoFianzas : [null],
//             totalCuotasFianzas : [null],
//             cPH : [null],
//             cPHUltimos12Meses : [null],
//             cPHUltimos24Meses : [null],
//             atrasoMaximo : [null],
//             atrasosUltimos12Meses : [null],
//             atrasosUltimos24Meses : [null],
//             diasAtrasoCorte : [null],
//             codigoCategoriaCredito : [null],
//             codigoTipoAsociado : [null]
//         });

//         this.formPersona = this.formBuilder.group({
//             identificacionPersona : [null, Validators.required],
//             nombrePersona : [null],
//             primerApellidoPersona : [null],
//             segundoApellidoPersona : [null],
//             estadoCivilPersona : [null],
//             codigoTipoPersona : [null],
//             codigoGeneroPersona : [null],
//             codigoCondicionLaboralPersona : [null],
//             codigoTipoHabitacionPersona : [null],
//             cantidadHijosPersona : [null],
//             fechaNacimientoPersona : [null],
//             estadoPersona : [null],
//             indAsociadoPersona : [null]
//         });
//     }
// }