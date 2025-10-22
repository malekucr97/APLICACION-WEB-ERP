import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';
import { Compania, User } from '@app/_models';
import {
  MacAnalisisCapacidadPago,
  MacDeduccionesAnalisis,
  MacExtrasAplicables,
  MacIngresosXAnalisis,
  MacListaExtras,
  MacMatrizAceptacionIngreso,
  MacPersona,
  MacTipoDeducciones,
  MacTipoIngreso,
  MacTiposMoneda,
} from '@app/_models/Macred';
import { AccountService, AlertService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { first } from 'rxjs/operators';
import { SrvDatosAnalisisService } from '../servicios/srv-datos-analisis.service';

declare var $: any;

@Component({selector: 'app-ingresos',
            templateUrl: './ingresos.component.html',
            styleUrls: [
                '../../../../../assets/scss/app.scss',
                '../../../../../assets/scss/macred/app.scss',
            ],
            standalone: false
})
export class IngresosComponent implements OnInit {
  
  // @Input() _globalCodMonedaPrincipal: number;
  // @Input() listTiposIngresos: MacTipoIngreso[];
  // @Input() listTiposDeducciones: MacTipoDeducciones[];
  // @Input() listMatrizAceptacionIngreso: MacMatrizAceptacionIngreso[];
  // @Input() listTiposMonedas: MacTiposMoneda[];
  
  @Input() _personaAnalisis: MacPersona;
  @Input() habilitaBtnPD: boolean = false;

  @Output() onHabilitarPD = new EventEmitter();


  listTiposIngresos: MacTipoIngreso[];
  listTiposDeducciones: MacTipoDeducciones[];
  listMatrizAceptacionIngreso: MacMatrizAceptacionIngreso[];
  listTiposMonedas: MacTiposMoneda[];

  private userObservable: User;
  private companiaObservable: Compania;

  public bordeSuccess = false;
  public bordeError = false;
  public bordeExtrasSuccess = false;
  public bordeExtrasError = false;

  listIngresosAnalisis: MacIngresosXAnalisis[];
  listDeduccionesAnalisis: MacDeduccionesAnalisis[];
  listTotalDeduccionesAnalisis: MacDeduccionesAnalisis[];
  listTempExtrasAplicables: MacExtrasAplicables[];
  // listExtrasAplicables: MacExtrasAplicables[];

  _ingresoAnalisisSeleccionado: MacIngresosXAnalisis;
  _deduccion: MacDeduccionesAnalisis;
  // _extrasAplicables: MacExtrasAplicables;

  habilitaIcoOpenModalExtras: boolean = false;
  habilitaIcoOpenModalDeducciones: boolean = false;
  
  habilitaBtnRegistrarIngreso: boolean = false;
  habilitaBtnActualizaIngreso: boolean = false;
  habilitaBtnActualizaDeduccion: boolean = false;
  habilitaBtnRegistraDeduccion: boolean = false;
  // habilitaBtnSubmitExtras: boolean = false;
  habilitaBtnFinalizarExtras: boolean = false;
  // habilitaBtnEliminarExtras: boolean = false;
  habilitaBtnFinalizarDeducciones: boolean = false;
  habilitaBtnNuevoIngreso: boolean = false;

  habilitaBtnLimpiarExtras: boolean = false;
  habilitaBtnNewExtra: boolean = false;
  habilitaBtnPostExtra: boolean = false;
  habilitaBtnPutExtra: boolean = false;
  habilitaBtnDeleteExtra: boolean = false;

  formIngresos: UntypedFormGroup;
  formExtras: UntypedFormGroup;
  formDeducciones: UntypedFormGroup;

  submittedIngresosForm: boolean = false;
  submittedExtrasForm: boolean = false;
  submittedDeduccionesForm: boolean = false;

  mesesAplicablesExtras : number;
  
  get i() { return this.formIngresos.controls; }
  get e() { return this.formExtras.controls; }
  get d() { return this.formDeducciones.controls; }

  objIngresoSeleccionado: MacIngresosXAnalisis = undefined;
  objExtrasSeleccionado: MacExtrasAplicables = undefined;

  oAnalisis : MacAnalisisCapacidadPago;

  public today : Date = new Date();

  constructor(private formBuilder: UntypedFormBuilder,
              private macredService: MacredService,
              private accountService: AccountService,
              private alertService: AlertService,
              private dialogo: MatDialog,
              public srvDatosAnalisisService: SrvDatosAnalisisService) {
    this.userObservable = this.accountService.userValue;
    this.companiaObservable = this.accountService.businessValue;
  }

  ngOnInit(): void {

    this.srvDatosAnalisisService.analisisCapacidadPago$.subscribe(
      analisis => { 
        if (analisis) this.oAnalisis = analisis; 
    });

    this.srvDatosAnalisisService.listIngresosAnalisis$.subscribe(
      lista => { 
        if (lista) {
          this.listIngresosAnalisis = lista;

          this.listIngresosAnalisis = this.listIngresosAnalisis.map(element => {
            const tipo = this.listTiposIngresos.find(x => x.id === element.codigoTipoIngreso);
            return { ...element, descTipoIngreso: tipo ? tipo.descripcion : '' };
          });
        }
    });

    this.mesesAplicablesExtras = this.srvDatosAnalisisService._globalMesesAplicaExtras;

    this.listTiposIngresos = this.srvDatosAnalisisService.listTiposIngresos;
    this.listTiposDeducciones = this.srvDatosAnalisisService.listTiposDeducciones;
    this.listMatrizAceptacionIngreso = this.srvDatosAnalisisService.listMatrizAceptacionIngreso;
    this.listTiposMonedas = this.srvDatosAnalisisService.listTiposMonedas;

    this.inicializaFormIngreso();
    this.inicializaFormExtras();
    this.inicializaFormDeducciones();
  }

  limpiarExtras() : void {
    this.listTempExtrasAplicables = null;
    this.inicializaFormExtras();
  }

  putExtras() : void { this.calcularExtras(false); }

  calcularExtras(registra : boolean = true) : void {

    var objExtra : MacExtrasAplicables = null;

    if (registra) {
      objExtra = this.obtenerDatosFormularioExtras(true);
    } else {
      objExtra = this.obtenerDatosFormularioExtras(false);
    }

    if ( objExtra ) {

      this.submittedExtrasForm = false;

      var cantRegistrosExtras: number = 0;
      var sumatoriaMontoExtras: number = 0.0;
      var potenciaSaldo: number = 0.0;
      var promedioExtras: number = 0.0;

      if (!this.listTempExtrasAplicables) this.listTempExtrasAplicables = [];

      this.listTempExtrasAplicables.push(objExtra);
      cantRegistrosExtras = this.listTempExtrasAplicables.length;

      sumatoriaMontoExtras = objExtra.sumatoriaExtras + objExtra.montoExtras;
      objExtra.sumatoriaExtras = sumatoriaMontoExtras;

      if (cantRegistrosExtras == 1) {

        objExtra.desviacionEstandar = 0;
        objExtra.coeficienteVarianza = 0;

        objExtra.promedioExtrasAplicables = objExtra.sumatoriaExtras;
        objExtra.porcentajeExtrasAplicables = objExtra.sumatoriaExtras;

      } else {

        promedioExtras = objExtra.sumatoriaExtras / cantRegistrosExtras;

        this.listTempExtrasAplicables.forEach((extra) => {
          potenciaSaldo += Math.pow(extra.montoExtras - promedioExtras, 2);
        });

        objExtra.desviacionEstandar = Math.sqrt(
          potenciaSaldo / (cantRegistrosExtras - 1)
        );

        objExtra.coeficienteVarianza = (objExtra.desviacionEstandar / promedioExtras) * 100;

        objExtra.promedioExtrasAplicables = promedioExtras;

        objExtra.porcentajeExtrasAplicables = 
          objExtra.promedioExtrasAplicables * (1 - objExtra.coeficienteVarianza / 100);
      }
      
      this.listTempExtrasAplicables[cantRegistrosExtras-1] = objExtra;
      this.objExtrasSeleccionado = objExtra;

      this.formExtras = this.formBuilder.group({
        montoExtra: [null, Validators.required],
        sumatoriaExtras: objExtra.sumatoriaExtras,
        desviacionEstandar: objExtra.desviacionEstandar,
        coeficienteVarianza: objExtra.coeficienteVarianza,
        porcentajeExtrasAplicable: objExtra.porcentajeExtrasAplicables,
        promedioExtrasAplicables: objExtra.promedioExtrasAplicables
      });

      if (registra) {
        
        this.habilitaBtnFinalizarExtras = true;
        this.habilitaBtnLimpiarExtras = true;
      
      } else {

        const objLista: MacListaExtras = {
          idExtras: objExtra.id,
          monto: objExtra.montoExtras,
          desviacion: objExtra.desviacionEstandar,
          coeficiente: objExtra.coeficienteVarianza,
          porcentaje: objExtra.porcentajeExtrasAplicables,
          promedio: objExtra.promedioExtrasAplicables
        };

        this.finalizaCalculoExtras(objLista);
      }
    }
  }
  async finalizaCalculoExtras(pobjActualiza : MacListaExtras = null): Promise<void> {

    this.alertService.clear();
    this.submittedExtrasForm = false;

    this.formExtras.get('montoExtra')?.disable();
    this.habilitaBtnExtras('finaliza');

    try {

      if (pobjActualiza) {

        const response = await this.srvDatosAnalisisService.actualizarExtras(this.objExtrasSeleccionado, pobjActualiza);

        if (response.exito) {

          this.objExtrasSeleccionado = response.objetoDb;

          this.formIngresos.patchValue({
              montoExtras: 
              parseFloat(response.objetoDb.porcentajeExtrasAplicables.toFixed(12))
          });

          this.alertService.success( response.responseMesagge );
          this.mostrarBordeExtras('success');

        } else { this.alertService.error(response.responseMesagge); this.mostrarBordeExtras('error'); }

      } else {

        const listaExtras = 
          this.listTempExtrasAplicables.map(e => Object.assign(new MacListaExtras(), {
            monto: e.montoExtras,
            desviacion: e.desviacionEstandar,
            coeficiente: e.coeficienteVarianza,
            porcentaje: e.porcentajeExtrasAplicables,
            promedio: e.promedioExtrasAplicables
          }));

          const response = await this.srvDatosAnalisisService.registrarExtras(this.objExtrasSeleccionado, listaExtras);

          if (response.exito) {

            this.objExtrasSeleccionado = response.objetoDb;
            
            this.formIngresos.patchValue({
                montoExtras: 
                parseFloat(response.objetoDb.porcentajeExtrasAplicables.toFixed(12))
            });

            this.alertService.success( response.responseMesagge );
            this.mostrarBordeExtras('success');

          } else { this.alertService.error(response.responseMesagge); this.mostrarBordeExtras('error'); }
      }
    } catch (error: any) { this.alertService.error(error); this.mostrarBordeExtras('error'); }
  }

  nuevoIngreso() : void { this.inicializaFormIngreso(); }
  
  nuevoExtras() : void { 

    if (this.objExtrasSeleccionado) {

      this.formExtras.patchValue({ montoExtra: null });
      this.habilitaBtnExtras('nuevo');
      this.formExtras.get('montoExtra')?.enable();
      
    } else { this.inicializaFormExtras(); }
  }

  inicializaFormIngreso(pingreso: MacIngresosXAnalisis = null): void {

    this.submittedIngresosForm = false;

    if (pingreso) {

      this.habilitaBtnNuevoIngreso = true;
      this.habilitaBtnPD = true;
      this.habilitaBtnActualizaIngreso = true;
      this.habilitaIcoOpenModalExtras = true;
      this.habilitaIcoOpenModalDeducciones = true;
      this.habilitaBtnRegistrarIngreso = false;
      

      this.formIngresos = this.formBuilder.group({
        codigoTipoIngreso: [this.listTiposIngresos.find((x) => x.id === pingreso.codigoTipoIngreso), Validators.required],
        montoBruto: [pingreso.montoBruto, Validators.required],
        montoNeto: [pingreso.montoNeto, Validators.required],
        cargasSociales: pingreso.cargasSociales,
        impuestoRenta: pingreso.impuestoRenta,
        montoExtras: pingreso.montoExtras,
        montoDeducciones: pingreso.montoDeducciones,

        totalMontoAnalisis: this.oAnalisis.totalMontoAnalisis,
        totalIngresoBruto: this.oAnalisis.totalIngresoBruto,
        totalIngresoNeto: this.oAnalisis.totalIngresoNeto,
        totalCargaImpuestos: this.oAnalisis.totalCargaImpuestos,
        totalExtrasAplicables: this.oAnalisis.totalExtrasAplicables,
        totalDeducciones: this.oAnalisis.totalDeducciones,
      });

      this.objIngresoSeleccionado = pingreso;

    } else {

      this.habilitaBtnNuevoIngreso = false;
      this.habilitaBtnPD = false;
      this.habilitaBtnActualizaIngreso = false;
      this.habilitaIcoOpenModalExtras = false;
      this.habilitaIcoOpenModalDeducciones = false;
      this.habilitaBtnRegistrarIngreso = true;
      

      this.formIngresos = this.formBuilder.group({
        codigoTipoIngreso: [null, Validators.required],
        montoBruto: [0, Validators.required],
        montoNeto: [0, Validators.required],
        cargasSociales: [0],
        impuestoRenta: [0],
        montoExtras: [0],
        montoDeducciones: [0],
        totalMontoAnalisis: [0],
        totalIngresoBruto: [0],
        totalIngresoNeto: [0],
        totalCargaImpuestos: [0],
        totalExtrasAplicables: [0],
        totalDeducciones: [0],
      });

      this.objIngresoSeleccionado = undefined;
    }
  }

  inicializaFormExtras(pextras : MacExtrasAplicables = null) : void {

    this.submittedExtrasForm = false;

    if (pextras) {

      this.formExtras = this.formBuilder.group({
        montoExtra: [pextras.montoExtras, Validators.required],
        sumatoriaExtras: pextras.sumatoriaExtras,
        desviacionEstandar: pextras.desviacionEstandar,
        coeficienteVarianza: pextras.coeficienteVarianza,
        porcentajeExtrasAplicable: pextras.porcentajeExtrasAplicables,
        promedioExtrasAplicables: pextras.promedioExtrasAplicables
      });

      this.objExtrasSeleccionado = pextras;
      this.habilitaBtnExtras('registra');
      
    } else {

      this.formExtras = this.formBuilder.group({
        montoExtra: [null, Validators.required],
        sumatoriaExtras: [null],
        desviacionEstandar: [null],
        coeficienteVarianza: [null],
        porcentajeExtrasAplicable: [null],
        promedioExtrasAplicables: [null]
      });

      this.objExtrasSeleccionado = undefined;
      this.habilitaBtnExtras('actualiza');
    }
  }
  inicializaFormDeducciones(registra : boolean = false) : void {

    if (registra) {

      this.habilitaBtnActualizaDeduccion = true;
      this.habilitaBtnRegistraDeduccion = false;

      this.formDeducciones = this.formBuilder.group({
        codigoTipoDeduccion: [this.listTiposDeducciones.find(
          (x) => x.id === this._deduccion.codigoTipoDeduccion), Validators.required],
        codigoTipoMoneda: [this.listTiposMonedas.find(
          (x) => x.id === this._deduccion.codigoMoneda), Validators.required],
        tipoCambio: [this._deduccion.tipoCambio, Validators.required],
        montoDeduccion: [this._deduccion.monto, Validators.required],
      });
      
    } else {

      this.habilitaBtnActualizaDeduccion = false;
      this.habilitaBtnRegistraDeduccion = true;

      this.formDeducciones = this.formBuilder.group({
        codigoTipoDeduccion: [null, Validators.required],
        codigoTipoMoneda: [this.listTiposMonedas.find(
          (x) => x.id === this.srvDatosAnalisisService._globalCodMonedaPrincipal), Validators.required],
        tipoCambio: [1, Validators.required],
        montoDeduccion: [null, Validators.required],
      });
    }
  }

  selectIngresoAnalisis(pingreso: MacIngresosXAnalisis): void {
    
    this.inicializaFormIngreso(pingreso);

    this.getExtrasAnalisis();
    this.getDeduccionesAnalisis();
  }

  async postIngreso(): Promise<void> {

    var ingreso: MacIngresosXAnalisis = this.obtenerDatosFormularioIngreso();

    if (ingreso) {

      try {
        const response = await this.srvDatosAnalisisService.registrarIngreso(ingreso);

        if (response.exito) {

          response.objetoDb.descTipoIngreso = ingreso.descTipoIngreso;

          if (!this.listIngresosAnalisis) this.listIngresosAnalisis = [];
          this.listIngresosAnalisis.push(response.objetoDb);

          this.totalizarMontosIngreso();
          this.inicializaFormIngreso();

          const analisisResponse = await this.srvDatosAnalisisService.actualizarAnalisis(this.oAnalisis);

          if (analisisResponse.exito) {

            this.srvDatosAnalisisService.setAnalisisCapacidadPago(this.oAnalisis);

            this.alertService.success( 
              `Ingreso: ${response.responseMesagge} Análisis: ${analisisResponse.responseMesagge}`
            );
            this.mostrarBorde('success');

          } else {
            this.alertService.error( analisisResponse.responseMesagge );
            this.mostrarBorde('error');
          }
          
        } else { this.alertService.error(response.responseMesagge); }
      } catch (error: any) { this.alertService.error(error); }
    }
  }
  async putIngreso(): Promise<void> {

    var ingreso: MacIngresosXAnalisis = this.obtenerDatosFormularioIngreso(false);

    if (ingreso) {

      try {
        const response = await this.srvDatosAnalisisService.actualizarIngreso(ingreso);

        if (response.exito) {

          const index = this.listIngresosAnalisis.findIndex(m => m.id === ingreso.id);
          if (index !== -1) this.listIngresosAnalisis[index] = ingreso;

          this.totalizarMontosIngreso();
          this.inicializaFormIngreso();

          const analisisResponse = await this.srvDatosAnalisisService.actualizarAnalisis(this.oAnalisis);

          if (analisisResponse.exito) {

            this.srvDatosAnalisisService.setAnalisisCapacidadPago(this.oAnalisis);

            this.alertService.success( 
              `Ingreso: ${response.responseMesagge} Análisis: ${analisisResponse.responseMesagge}`
            );
            this.mostrarBorde('success');

          } else {
            this.alertService.error( analisisResponse.responseMesagge );
            this.mostrarBorde('error');
          }
            
        } else { this.alertService.error(response.responseMesagge); }
      } catch (error: any) { this.alertService.error(error); }
    }
  }

  selectDeduccionAnalisis(deduccion: MacDeduccionesAnalisis): void {
    // limpia formulario
    if (this._deduccion && this._deduccion.id === deduccion.id) {
      this._deduccion = null;
      this.inicializaFormDeducciones();
      return;
    }
    this._deduccion = deduccion;
    this.inicializaFormDeducciones();
  }

  // deducciones
  getDeduccionesAnalisis(): void {

    var deduccionesAnalisis: number = 0;
    var deduccionesIngreso: number = 0;
    
    this.macredService.getDeduccionesAnalisis(this.oAnalisis.codigoAnalisis)
      .pipe(first())
      .subscribe((tresponse) => {

        if (tresponse?.length) tresponse.forEach((element) => { deduccionesAnalisis += element.monto; });
        
        this.macredService.getDeduccionesAnalisisIngreso(this.oAnalisis.codigoAnalisis, this.objIngresoSeleccionado.id)
          .pipe(first())
          .subscribe((dresponse) => {

            if (dresponse?.length) dresponse.forEach((element) => { deduccionesIngreso += element.monto; });

            this.formIngresos.patchValue({ totalDeducciones: deduccionesAnalisis });
            this.formIngresos.patchValue({ montoDeducciones: deduccionesIngreso });
              
          });
      });
  }
  // extras
  getExtrasAnalisis(): void {

    this.macredService.getExtrasAplicablesIngreso(this.oAnalisis.codigoAnalisis,
                                                  this.objIngresoSeleccionado.id)
      .pipe(first())
      .subscribe((responseExtras) => {

        if (responseExtras) {
          
          this.macredService.getListaExtrasAplicables(responseExtras.id)
            .pipe(first())
            .subscribe((responseLista) => {

              this.listTempExtrasAplicables = [];
              let sumatoriaExtras : number = 0;

              responseLista.forEach(element => {
                
                let extra : MacExtrasAplicables = new MacExtrasAplicables();

                extra.codigoCompania = this.companiaObservable.id;
                extra.codigoAnalisis = this.oAnalisis.codigoAnalisis;
                extra.codigoIngreso = this.objIngresoSeleccionado.id;

                extra.montoExtras = element.monto;
                extra.desviacionEstandar = element.desviacion;
                extra.coeficienteVarianza = element.coeficiente;
                extra.porcentajeExtrasAplicables = element.porcentaje;
                extra.promedioExtrasAplicables = element.promedio;

                sumatoriaExtras += element.monto;
                extra.sumatoriaExtras = sumatoriaExtras;

                this.listTempExtrasAplicables.push(extra);
              });

              responseExtras.sumatoriaExtras = sumatoriaExtras;
              responseExtras.montoExtras = null;
              this.inicializaFormExtras(responseExtras);

              this.formIngresos.patchValue({
                montoExtras: 
                parseFloat(this.objExtrasSeleccionado.porcentajeExtrasAplicables.toFixed(12))
              });
            });

        } else { this.listTempExtrasAplicables = undefined; this.inicializaFormExtras(); }

      });
  }

  deleteIngreso(ingreso: MacIngresosXAnalisis): void {
    this.alertService.clear();

    this.dialogo
      .open(DialogoConfirmacionComponent, {
        data: `Seguro que desea eliminar el ingreso seleccionado ?`,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          // elimina registros de dependencia del ingreso: deducciones y extras aplicables
          if (this.listDeduccionesAnalisis) {
            this.listDeduccionesAnalisis.forEach((element) => {
              if (element.codigoIngreso == ingreso.id)
                this.eliminarRegistroDeduccion(element.id);
            });
          }
          if (
            this.objExtrasSeleccionado &&
            this.objExtrasSeleccionado.codigoIngreso == ingreso.id
          ) {
            this.deleteAutoExtras(this.objExtrasSeleccionado.id);
          }
          // ***

          this.macredService
            .deleteIngreso(ingreso.id)
            .pipe(first())
            .subscribe((response) => {
              if (response.exito) {
                this.listIngresosAnalisis.splice(
                  this.listIngresosAnalisis.findIndex(
                    (m) => m.id == ingreso.id
                  ),
                  1
                );

                if (this.listIngresosAnalisis.length === 0)
                  this.listIngresosAnalisis = null;

                this._ingresoAnalisisSeleccionado = null;
                this._deduccion = null;
                this.objExtrasSeleccionado = null;

                this.inicializaFormIngreso();

                this.alertService.success(response.responseMesagge);
              } else {
                this.alertService.error(response.responseMesagge);
              }
            });
        } else {
          return;
        }
      });
  }

  eliminarDeduccion(deduccion: MacDeduccionesAnalisis): void {
    this.alertService.clear();

    this.dialogo
      .open(DialogoConfirmacionComponent, {
        data: `Seguro que desea eliminar la deducción seleccionada ?`,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.macredService
            .deleteDeduccion(deduccion.id)
            .pipe(first())
            .subscribe((response) => {
              if (response.exito) {
                this.getDeduccionesAnalisis();

                this.habilitaBtnFinalizarDeducciones = true;

                this._deduccion = null;
                this.inicializaFormDeducciones();

                this.alertService.success(response.responseMesagge);
              } else {
                this.alertService.error(response.responseMesagge);
              }
            });
        } else {
          return;
        }
      });
  }

  eliminarRegistroDeduccion(idDeduccion: number): void {
    this.macredService
      .deleteDeduccion(idDeduccion)
      .pipe(first())
      .subscribe((response) => {
        if (!response.exito) {
          this.alertService.error(response.responseMesagge);
          return;
        }
      });
  }
  // *** //


  finalizarFormularioDeducciones(): void {
    var totalDeducciones: number = 0;
    var totalDeduccionesIngreso: number = 0;

    this.formIngresos.patchValue({ montoDeducciones: 0 });
    this.formIngresos.patchValue({ totalDeducciones: 0 });

    if (this.listDeduccionesAnalisis)
      this.listDeduccionesAnalisis.forEach((element) => {
        totalDeduccionesIngreso += element.monto;
      });

    if (this.listTotalDeduccionesAnalisis)
      this.listTotalDeduccionesAnalisis.forEach((element) => {
        totalDeducciones += element.monto;
      });

    this.formIngresos.patchValue({ montoDeducciones: totalDeduccionesIngreso });
    this.formIngresos.patchValue({ totalDeducciones: totalDeducciones });

    this.habilitaBtnFinalizarDeducciones = false;

    this.putIngreso();

    $('#deduccionesModal').modal('hide');
  }

  SubmitFormDeducciones(): void {
    this.alertService.clear();
    this.submittedDeduccionesForm = true;

    if (this.formDeducciones.invalid) return;

    var deduccion: MacDeduccionesAnalisis = this.createDeduccionObjectForm();
    deduccion.adicionadoPor = this.userObservable.identificacion;
    deduccion.fechaAdicion = this.today;

    this.macredService
      .postDeduccionesAnalisis(deduccion)
      .pipe(first())
      .subscribe((response) => {
        if (response) {
          this.getDeduccionesAnalisis();

          this.inicializaFormDeducciones();

          // if (!this.listDeduccionesAnalisis) this.listDeduccionesAnalisis = [];

          // this.listDeduccionesAnalisis.push(response);

          this.habilitaBtnFinalizarDeducciones = true;

          this.alertService.success(
            `Registro de Deducciones realizado con éxito.`
          );
        } else {
          this.alertService.error(
            `Problemas al registrar las Deducciones del Análisis de Capacidad de Pago.`
          );
        }
      });
  }

  deleteExtras(): void {

    this.dialogo.open(DialogoConfirmacionComponent, {
      data: `Seguro que desea eliminar las extras para el ingreso ${this.objIngresoSeleccionado.id} ?`,
    })
    .afterClosed()
    .subscribe((confirmado: Boolean) => {
      if (confirmado) {

        this.macredService.deleteExtrasAplicables(this.objExtrasSeleccionado.id)
          .pipe(first())
          .subscribe((response) => {

            if (response.exito) {

              this.objExtrasSeleccionado = null;
              this.listTempExtrasAplicables = null;

              this.inicializaFormExtras();

              this.formIngresos.patchValue({ montoExtras: 0 });

              $('#extrasModal').modal('hide');

              this.alertService.success(response.responseMesagge);

            } else { this.alertService.error(response.responseMesagge); }
          });

      } else { return; }
    });
  }

  // elimina registros de forma interna para el ingreso y ejecución de procesos sin confirmación
  deleteAutoExtras(idExtras: number): void {
    this.macredService.deleteExtrasAplicables(idExtras)
      .pipe(first())
      .subscribe((response) => {
        if (!response.exito) {
          this.alertService.error(response.responseMesagge);
          return;
        }
      });
  }

  private obtenerDatosFormularioIngreso(registra : boolean = true): MacIngresosXAnalisis {

    this.alertService.clear();
    this.submittedIngresosForm = true;

    if (this.formIngresos.invalid) return null;

    const { codigoTipoIngreso, 
            montoBruto, 
            montoExtras, 
            cargasSociales, 
            impuestoRenta, 
            montoNeto,
            montoDeducciones } = this.formIngresos.controls;

    if (montoBruto.value <= 0) {
      this.formIngresos.controls['montoBruto'].setErrors({ error: true });
      return;
    }
    
    var obj: MacIngresosXAnalisis = new MacIngresosXAnalisis();

    obj.codigoAnalisis = this.oAnalisis.codigoAnalisis;
    obj.codigoTipoMoneda = this.oAnalisis.codigoMoneda;
    
    obj.codigoTipoIngreso = codigoTipoIngreso.value.id;
    obj.montoBruto = montoBruto.value;
    obj.montoExtras = montoExtras.value;
    obj.cargasSociales = cargasSociales.value;
    obj.impuestoRenta = impuestoRenta.value;
    obj.montoNeto = montoNeto.value;
    obj.montoDeducciones = montoDeducciones.value;

    obj.descTipoIngreso = this.listTiposIngresos.find(x => x.id === obj.codigoTipoIngreso).descripcion;

    if (registra) {

      obj.codigoCompania = this.companiaObservable.id;
      obj.adicionadoPor = this.userObservable.identificacion; 
      obj.fechaAdicion = this.today;

    } else {

      obj.id = this.objIngresoSeleccionado.id;
      obj.modificadoPor = this.userObservable.identificacion; 
      obj.fechaModificacion = this.today;

      this.oAnalisis.modificadoPor = this.userObservable.identificacion;
      this.oAnalisis.fechaModificacion = this.today;
    }
    return obj;
  }
  private obtenerDatosFormularioExtras(registra : boolean = true): MacExtrasAplicables {

    this.alertService.clear();
    this.submittedExtrasForm = true;

    if (this.formExtras.invalid) return null;

    const { montoExtra, 
            sumatoriaExtras,
            porcentajeExtrasAplicable, 
            desviacionEstandar, 
            coeficienteVarianza, 
            promedioExtrasAplicables } = this.formExtras.controls;

    if (montoExtra.value <= 0) {
      this.formExtras.controls['montoExtra'].setErrors({ error: true });
      return null;
    }

    var obj: MacExtrasAplicables = new MacExtrasAplicables();

    obj.codigoAnalisis = this.oAnalisis.codigoAnalisis;
    obj.codigoIngreso = this.objIngresoSeleccionado.id;

    obj.montoExtras = montoExtra.value;
    obj.sumatoriaExtras = sumatoriaExtras.value;
    obj.porcentajeExtrasAplicables = porcentajeExtrasAplicable.value;
    obj.desviacionEstandar = desviacionEstandar.value;
    obj.coeficienteVarianza = coeficienteVarianza.value;
    obj.promedioExtrasAplicables = promedioExtrasAplicables.value;

    if (registra) {

      obj.codigoCompania = this.companiaObservable.id;
      obj.adicionadoPor = this.userObservable.identificacion; 
      obj.fechaAdicion = this.today;

    } else {

      obj.id = this.objExtrasSeleccionado.id;
      obj.modificadoPor = this.userObservable.identificacion; 
      obj.fechaModificacion = this.today;

      this.oAnalisis.modificadoPor = this.userObservable.identificacion;
      this.oAnalisis.fechaModificacion = this.today;
    }
    return obj;
  }

  createDeduccionObjectForm(): MacDeduccionesAnalisis {
    var deduccion: MacDeduccionesAnalisis = new MacDeduccionesAnalisis();

    deduccion.codigoAnalisis = this.oAnalisis.codigoAnalisis;
    deduccion.codigoCompania = this.companiaObservable.id;
    deduccion.codigoIngreso = this._ingresoAnalisisSeleccionado.id;

    deduccion.codigoTipoDeduccion =
      this.formDeducciones.controls['codigoTipoDeduccion'].value.id;
    deduccion.codigoMoneda =
      this.formDeducciones.controls['codigoTipoMoneda'].value.id;
    deduccion.tipoCambio = this.formDeducciones.controls['tipoCambio'].value;
    deduccion.monto = this.formDeducciones.controls['montoDeduccion'].value;

    return deduccion;
  }

  ActualizaFormDeducciones(): void {
    this.alertService.clear();
    this.submittedDeduccionesForm = true;

    if (this.formDeducciones.invalid) return;

    var deduccion: MacDeduccionesAnalisis = this.createDeduccionObjectForm();
    deduccion.id = this._deduccion.id;
    deduccion.modificadoPor = this.userObservable.identificacion;
    deduccion.fechaModificacion = this.today;

    this.macredService
      .putDeduccionAnalisis(deduccion)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.getDeduccionesAnalisis();

          this.habilitaBtnFinalizarDeducciones = true;

          this._deduccion = null;
          this.inicializaFormDeducciones();

          this.alertService.success(response.responseMesagge);
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
  }

  totalizarMontosIngreso(): void {
    let totalDeducciones: number = 0;
    let totalIngresoBruto: number = 0;
    let totalCargasImpuestos: number = 0;
    let totalExtrasAplicables: number = 0;

    let totalIngresoNeto: number = 0;
    let totalIngresoAnalisis: number = 0;

    if (this.listTotalDeduccionesAnalisis) {
      this.listTotalDeduccionesAnalisis.forEach((deduccion) => {
        totalDeducciones += deduccion.monto;
      });
    }

    this.listIngresosAnalisis.forEach((ingreso) => {
      totalIngresoBruto += ingreso.montoBruto;
      totalCargasImpuestos += ingreso.cargasSociales + ingreso.impuestoRenta;

      totalExtrasAplicables += ingreso.montoExtras;
    });

    totalIngresoNeto = totalIngresoBruto - totalCargasImpuestos;
    totalIngresoAnalisis = totalIngresoNeto + totalExtrasAplicables;

    this.oAnalisis.totalCargaImpuestos = totalCargasImpuestos;
    this.oAnalisis.totalDeducciones = totalDeducciones;
    this.oAnalisis.totalExtrasAplicables = totalExtrasAplicables;
    this.oAnalisis.totalIngresoBruto = totalIngresoBruto;
    this.oAnalisis.totalIngresoNeto = totalIngresoNeto;
    this.oAnalisis.totalMontoAnalisis = totalIngresoAnalisis;
  }

  handleHabilitarPD(): void { this.onHabilitarPD.emit(); }

  cerrarExtrasModal(): void { $('#extrasModal').modal('hide'); }
  CerrarDeduccionesModal(): void { $('#deduccionesModal').modal('hide'); }

  openExtrasModal(): void {

    this.submittedExtrasForm = false;

    if (this.objExtrasSeleccionado) this.formExtras.get('montoExtra')?.disable();

    if (this.objExtrasSeleccionado && this.habilitaBtnPutExtra) this.habilitaBtnExtras('registra');

    $('#extrasModal').modal({ backdrop: 'static', keyboard: false }, 'show');
  }
  openDeduccionesModal(): void { $('#deduccionesModal').modal({ backdrop: 'static', keyboard: false }, 'show'); }

  private habilitaBtnExtras(accion : string) : void {

    switch (accion) {
      case 'registra':
        this.habilitaBtnNewExtra = true;
        this.habilitaBtnDeleteExtra = true;
        this.habilitaBtnPutExtra = false;
        this.habilitaBtnPostExtra = false;
        break;

      case 'actualiza':
        this.habilitaBtnPostExtra = true;
        this.habilitaBtnNewExtra = false;
        this.habilitaBtnPutExtra = false;
        this.habilitaBtnDeleteExtra = false;
        this.habilitaBtnFinalizarExtras = false;
        this.habilitaBtnLimpiarExtras = false;
        break;

      case 'elimina':
        
        break;

      case 'nuevo':
        this.habilitaBtnPutExtra = true;
        this.habilitaBtnNewExtra = false;
        this.habilitaBtnDeleteExtra = false;
        break;

      case 'finaliza':
        this.habilitaBtnNewExtra = true;
        this.habilitaBtnDeleteExtra = true;
        this.habilitaBtnFinalizarExtras = false;
        this.habilitaBtnLimpiarExtras = false;
        this.habilitaBtnPostExtra = false;
        this.habilitaBtnPutExtra = false;
        break;
    
      default:
        break;
    }
  }
  private mostrarBorde(tipo: 'success' | 'error') {
    this.bordeSuccess = tipo === 'success';
    this.bordeError = tipo === 'error';
    setTimeout(() => { this.bordeSuccess = false; this.bordeError = false; }, 2000);
  }
  private mostrarBordeExtras(tipo: 'success' | 'error') {
    this.bordeExtrasSuccess = tipo === 'success';
    this.bordeExtrasError = tipo === 'error';
    setTimeout(() => { this.bordeExtrasSuccess = false; this.bordeExtrasError = false; }, 2000);
  }
}


  // createIngresoObjectForm(): MacIngresosXAnalisis {
  //   var ingresoAnalisis: MacIngresosXAnalisis = new MacIngresosXAnalisis();

  //   ingresoAnalisis.codigoAnalisis = this.oAnalisis.codigoAnalisis;
  //   ingresoAnalisis.codigoCompania = this.companiaObservable.id;

  //   ingresoAnalisis.codigoTipoIngreso =
  //     this.formIngresos.controls['codigoTipoIngreso'].value.id;
  //   ingresoAnalisis.codigoTipoMoneda = this.oAnalisis.codigoMoneda;
  //   ingresoAnalisis.montoBruto = this.formIngresos.controls['montoBruto'].value;
  //   ingresoAnalisis.montoExtras =
  //     this.formIngresos.controls['montoExtras'].value;
  //   ingresoAnalisis.cargasSociales =
  //     this.formIngresos.controls['cargasSociales'].value;
  //   ingresoAnalisis.impuestoRenta =
  //     this.formIngresos.controls['impuestoRenta'].value;
  //   ingresoAnalisis.montoNeto = this.formIngresos.controls['montoNeto'].value;
  //   ingresoAnalisis.montoDeducciones =
  //     this.formIngresos.controls['montoDeducciones'].value;

  //   return ingresoAnalisis;
  // }

  // inicializaFormDeducciones(): void {
  //   if (this._deduccion) {
  //     this.habilitaBtnActualizaDeduccion = true;
  //     this.habilitaBtnRegistraDeduccion = false;

  //     this.formDeducciones = this.formBuilder.group({
  //       codigoTipoDeduccion: [
  //         this.listTiposDeducciones.find(
  //           (x) => x.id === this._deduccion.codigoTipoDeduccion
  //         ),
  //         Validators.required,
  //       ],
  //       codigoTipoMoneda: [
  //         this.listTiposMonedas.find(
  //           (x) => x.id === this._deduccion.codigoMoneda
  //         ),
  //         Validators.required,
  //       ],
  //       tipoCambio: [this._deduccion.tipoCambio, Validators.required],
  //       montoDeduccion: [this._deduccion.monto, Validators.required],
  //     });
  //   } else {
  //     this.habilitaBtnActualizaDeduccion = false;
  //     this.habilitaBtnRegistraDeduccion = true;

  //     this.formDeducciones = this.formBuilder.group({
  //       codigoTipoDeduccion: [null, Validators.required],
  //       codigoTipoMoneda: [
  //         this.listTiposMonedas.find(
  //           (x) => x.id === this.srvDatosAnalisisService._globalCodMonedaPrincipal
  //         ),
  //         Validators.required,
  //       ],
  //       tipoCambio: [1, Validators.required],
  //       montoDeduccion: [null, Validators.required],
  //     });
  //   }
  // }

    // totalizarDeducciones(): void {

  //   var totalDeduccionesIngreso: number = 0;
  //   var totalDeduccionesAnalisis: number = 0;
    
  //   if (this.listDeduccionesAnalisis)
  //     this.listDeduccionesAnalisis.forEach((element) => {
  //       totalDeduccionesIngreso += element.monto;
  //     });

  //   if (this.listTotalDeduccionesAnalisis)
  //     this.listTotalDeduccionesAnalisis.forEach((element) => {
  //       totalDeduccionesAnalisis += element.monto;
  //     });

  //   this.formIngresos.patchValue({ montoDeducciones: totalDeduccionesIngreso });
  //   this.formIngresos.patchValue({ totalDeducciones: totalDeduccionesAnalisis });
  // }

    // inicializaFormExtrasAplicables(pextras : MacExtrasAplicables): void {
  //   this.habilitaBtnSubmitExtras = true;

  //   if (this._extrasAplicables) {
  //     this.habilitaBtnEliminarExtras = true;

  //     this.formExtras = this.formBuilder.group({
  //       montoExtra: [this._extrasAplicables.montoExtras, Validators.required],
  //       desviacionEstandar: this._extrasAplicables.desviacionEstandar,
  //       coeficienteVarianza: this._extrasAplicables.coeficienteVarianza,
  //       porcentajeExtrasAplicable:
  //         this._extrasAplicables.porcentajeExtrasAplicables,
  //       promedioExtrasAplicables:
  //         this._extrasAplicables.promedioExtrasAplicables
  //     });
  //   } else {
  //     this.habilitaBtnEliminarExtras = false;

  //     this.formExtras = this.formBuilder.group({
  //       montoExtra: [0, Validators.required],
  //       desviacionEstandar: 0,
  //       coeficienteVarianza: 0,
  //       porcentajeExtrasAplicable: 0,
  //       promedioExtrasAplicables: 0,
  //       // ,
  //       // mesesExtrasAplicables       : this._globalMesesAplicaExtras
  //     });
  //   }
  // }

  // finalizaCalculoExtras(): void {

  //   this.alertService.clear();
  //   var extrasAplicables: MacExtrasAplicables = new MacExtrasAplicables();

  //   var sumatoriaMontoExtras: number = 0.0;

  //   // registro automático meses aplicables
  //   // if (this.listExtrasAplicables.length > 1) {
  //   //     if (this.listExtrasAplicables.length < this._globalMesesAplicaExtras ) {
  //   //         var iteraciones = this._globalMesesAplicaExtras - this.listExtrasAplicables.length;
  //   //         for ( let index = 0; index < iteraciones ; index++ ) { this.SubmitFormExtras(true); }
  //   //     }
  //   // }

  //   this.listTempExtrasAplicables.forEach((extra) => {
  //     sumatoriaMontoExtras += extra.montoExtras;
  //   });

  //   extrasAplicables =
  //     this.listExtrasAplicables[this.listExtrasAplicables.length - 1];
  //   extrasAplicables.montoExtras = sumatoriaMontoExtras;

  //   this.macredService
  //     .postExtrasAplicables(extrasAplicables)
  //     .pipe(first())
  //     .subscribe((response) => {
  //       if (response) {
  //         this.listExtrasAplicables = null;
  //         this.listTempExtrasAplicables = null;

  //         this.habilitaBtnFinalizarExtras = false;
  //         // this.habilitaBtnSubmitExtras = false;

  //         this._extrasAplicables = response;
  //         this.inicializaFormExtras();

  //         this.formIngresos.patchValue({
  //           montoExtras: this._extrasAplicables.porcentajeExtrasAplicables,
  //         });

  //         this.alertService.success(`Registro de Extras realizado con éxito..`);
  //       } else {
  //         let message: string =
  //           'Problemas al registrar el Análisis de Capacidad de Pago.';
  //         this.alertService.error(message);
  //       }
  //     });
  // }

  // SubmitFormExtras(): void {

  //   var cantRegistrosExtras: number = 0;
  //   var sumatoriaMontoExtras: number = 0.0;
  //   var potenciaSaldo: number = 0.0;
  //   var promedioExtras: number = 0.0;

  //   if (!this.listExtrasAplicables) this.listExtrasAplicables = [];
  //   if (!this.listTempExtrasAplicables) this.listTempExtrasAplicables = [];

  //   var montoExtra: MacExtrasAplicables = this.obtenerDatosFormularioExtras(true);

  //   if (montoExtra) {

  //     this.listTempExtrasAplicables.push(montoExtra);
  //     cantRegistrosExtras = this.listTempExtrasAplicables.length;

  //     this.listTempExtrasAplicables.forEach((extra) => {
  //       sumatoriaMontoExtras += extra.montoExtras;
  //     });

  //     if (cantRegistrosExtras == 1) {

  //       promedioExtras = sumatoriaMontoExtras;

  //       montoExtra.desviacionEstandar = 0;
  //       montoExtra.coeficienteVarianza = 0;

  //       montoExtra.promedioExtrasAplicables = sumatoriaMontoExtras;
  //       montoExtra.porcentajeExtrasAplicables = sumatoriaMontoExtras;

  //   } else {

  //     promedioExtras = sumatoriaMontoExtras / cantRegistrosExtras;

  //     this.listTempExtrasAplicables.forEach((extra) => {
  //       potenciaSaldo += Math.pow(extra.montoExtras - promedioExtras, 2);
  //     });

  //     montoExtra.desviacionEstandar = Math.sqrt(
  //       potenciaSaldo / (cantRegistrosExtras - 1)
  //     );

  //     montoExtra.coeficienteVarianza = (montoExtra.desviacionEstandar / promedioExtras) * 100;

  //     montoExtra.promedioExtrasAplicables = promedioExtras;

  //     montoExtra.porcentajeExtrasAplicables = 
  //       montoExtra.promedioExtrasAplicables * (1 - montoExtra.coeficienteVarianza / 100);
  //   }

  //   this.inicializaFormExtras();

  //   this.listExtrasAplicables.push(montoExtra);

  //   this.habilitaBtnFinalizarExtras = true;

  //   // var extrasAplicables: MacExtrasAplicables = new MacExtrasAplicables();

  //   // extrasAplicables.codigoAnalisis = montoExtra.codigoAnalisis;
  //   // extrasAplicables.codigoCompania = montoExtra.codigoCompania;
  //   // extrasAplicables.codigoIngreso = montoExtra.codigoIngreso;
  //   // extrasAplicables.adicionadoPor = montoExtra.adicionadoPor;
  //   // extrasAplicables.fechaAdicion = montoExtra.fechaAdicion;

  //   // extrasAplicables.montoExtras = montoExtra.montoExtras;
  //   // extrasAplicables.desviacionEstandar = montoExtra.desviacionEstandar;
  //   // extrasAplicables.coeficienteVarianza = montoExtra.coeficienteVarianza;
  //   // extrasAplicables.porcentajeExtrasAplicables = montoExtra.porcentajeExtrasAplicables;
  //   // extrasAplicables.promedioExtrasAplicables = montoExtra.promedioExtrasAplicables;

  //   // this.listExtrasAplicables.push(montoExtra);

  //   // this.habilitaBtnFinalizarExtras = true;
  // }


  //   // this.alertService.clear();
  //   // this.submittedExtrasForm = true;
  //   // var factorAceptacion : number = 0 ;
  //   // if (this.formExtras.invalid) return;
  //   // if (this.formExtras.controls['montoExtra'].value === 0) {
  //   //   this.formExtras.controls['montoExtra'].setErrors({ error: true });
  //   //   return;
  //   // }

  //   // if (this._extrasAplicables) {
  //   //   this.eliminarRegistroExtra(this._extrasAplicables.id);
  //   //   this.listTempExtrasAplicables = [];
  //   //   this.listExtrasAplicables = [];
  //   //   this._extrasAplicables = null;
  //   //   this.habilitaBtnEliminarExtras = false;
  //   // }


  //   // extrasTempAplicables.montoExtras = this.formExtras.controls['montoExtra'].value;

  //   // this.listTempExtrasAplicables.push(extrasTempAplicables);
  //   // cantidadRegistrosExtras = this.listTempExtrasAplicables.length;

  //   // sumatoria total extras
  // //   this.listTempExtrasAplicables.forEach((extra) => {
  // //     sumatoriaMontoExtras += extra.montoExtras;
  // //   });

  // //   if (cantidadRegistrosExtras == 1) {
  // //     promedioExtras = sumatoriaMontoExtras;

  // //     extrasTempAplicables.desviacionEstandar = 0;
  // //     extrasTempAplicables.coeficienteVarianza = 0;

  // //     extrasTempAplicables.promedioExtrasAplicables = sumatoriaMontoExtras;
  // //     extrasTempAplicables.porcentajeExtrasAplicables = sumatoriaMontoExtras;
  // //   } else {
  // //     var temPromedioTotalExtrasPermitidas =
  // //       sumatoriaMontoExtras / cantidadRegistrosExtras;

  // //     promedioExtras = temPromedioTotalExtrasPermitidas;

  // //     this.listTempExtrasAplicables.forEach((extra) => {
  // //       potenciaSaldo += Math.pow(extra.montoExtras - promedioExtras, 2);
  // //     });

  // //     var tempDesviacionEstandar = Math.sqrt(
  // //       potenciaSaldo / (cantidadRegistrosExtras - 1)
  // //     );
  // //     extrasTempAplicables.desviacionEstandar = tempDesviacionEstandar;

  // //     var tempCoeficienteVarianza =
  // //       extrasTempAplicables.desviacionEstandar / promedioExtras;
  // //     extrasTempAplicables.coeficienteVarianza = tempCoeficienteVarianza * 100;

  // //     var tempCoeficienteVarianzaPorcentual =
  // //       extrasTempAplicables.coeficienteVarianza;

  // //     tempCoeficienteVarianzaPorcentual =
  // //       tempCoeficienteVarianzaPorcentual >= 1
  // //         ? 1
  // //         : tempCoeficienteVarianzaPorcentual;

  // //     // this.listMatrizAceptacionIngreso.forEach(element => {
  // //     //     if ( element.rangoDesviacion1   <= tempCoeficienteVarianzaPorcentual &&
  // //     //         element.rangoDesviacion2    >= tempCoeficienteVarianzaPorcentual   ) factorAceptacion = element.factor ;
  // //     // });

  // //     extrasTempAplicables.promedioExtrasAplicables = promedioExtras;

  // //     extrasTempAplicables.porcentajeExtrasAplicables =
  // //       extrasTempAplicables.promedioExtrasAplicables *
  // //       (1 - extrasTempAplicables.coeficienteVarianza / 100);
  // // }

  //   // this.inicializaFormExtras();

  //   // var extrasAplicables: MacExtrasAplicables = new MacExtrasAplicables();

  //   // extrasAplicables.codigoAnalisis = this.oAnalisis.codigoAnalisis;
  //   // extrasAplicables.codigoCompania = this.companiaObservable.id;
  //   // extrasAplicables.codigoIngreso = this._ingresoAnalisisSeleccionado.id;
  //   // extrasAplicables.adicionadoPor = this.userObservable.identificacion;
  //   // extrasAplicables.fechaAdicion = this.today;

  //   // extrasAplicables.montoExtras = extrasTempAplicables.montoExtras;
  //   // extrasAplicables.desviacionEstandar = extrasTempAplicables.desviacionEstandar;
  //   // extrasAplicables.coeficienteVarianza = extrasTempAplicables.coeficienteVarianza;
  //   // extrasAplicables.porcentajeExtrasAplicables = extrasTempAplicables.porcentajeExtrasAplicables;
  //   // extrasAplicables.promedioExtrasAplicables = extrasTempAplicables.promedioExtrasAplicables;

  //   // this.listExtrasAplicables.push(extrasAplicables);

  //   // this.habilitaBtnFinalizarExtras = true;
  // }

  // finalizaCalculoExtras(): void {

  //   this.alertService.clear();
  //   var extrasAplicables: MacExtrasAplicables = new MacExtrasAplicables();

  //   var sumatoriaMontoExtras: number = 0.0;

  //   // registro automático meses aplicables
  //   // if (this.listExtrasAplicables.length > 1) {
  //   //     if (this.listExtrasAplicables.length < this._globalMesesAplicaExtras ) {
  //   //         var iteraciones = this._globalMesesAplicaExtras - this.listExtrasAplicables.length;
  //   //         for ( let index = 0; index < iteraciones ; index++ ) { this.SubmitFormExtras(true); }
  //   //     }
  //   // }

  //   this.listTempExtrasAplicables.forEach((extra) => {
  //     sumatoriaMontoExtras += extra.montoExtras;
  //   });

  //   extrasAplicables = this.listExtrasAplicables[this.listExtrasAplicables.length - 1];
  //   extrasAplicables.montoExtras = sumatoriaMontoExtras;

  //   this.macredService
  //     .postExtrasAplicables(extrasAplicables)
  //     .pipe(first())
  //     .subscribe((response) => {
  //       if (response) {
  //         this.listExtrasAplicables = null;
  //         this.listTempExtrasAplicables = null;

  //         this.habilitaBtnFinalizarExtras = false;
  //         // this.habilitaBtnSubmitExtras = false;

  //         this._extrasAplicables = response;
  //         this.inicializaFormExtras();

  //         this.formIngresos.patchValue({
  //           montoExtras: this._extrasAplicables.porcentajeExtrasAplicables,
  //         });

  //         this.alertService.success(`Registro de Extras realizado con éxito..`);
  //       } else {
  //         let message: string =
  //           'Problemas al registrar el Análisis de Capacidad de Pago.';
  //         this.alertService.error(message);
  //       }
  //     });
  // }