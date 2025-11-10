import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';
import { Compania, ResponseMessage, User } from '@app/_models';
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
import { firstValueFrom } from 'rxjs';

declare var $: any;

@Component({selector: 'app-ingresos',
            templateUrl: './ingresos.component.html',
            styleUrls: ['../../../../../assets/scss/macred/app.scss'],
            standalone: false
})
export class IngresosComponent implements OnInit {
  
  // @Input() oPersona: MacPersona;
  // @Input() habilitaBtnPD: boolean = false;

  @Output() onPD = new EventEmitter();

  public listTiposIngresos: MacTipoIngreso[];
  public listTiposDeducciones: MacTipoDeducciones[];
  public listTiposMonedas: MacTiposMoneda[];
  private matrizAceptacion: MacMatrizAceptacionIngreso[];

  private userObservable: User;
  private companiaObservable: Compania;

  public bordeSuccessIngresos = false;
  public bordeErrorIngresos = false;
  public bordeExtrasSuccess = false;
  public bordeExtrasError = false;
  public bordeDeduccionesError = false;
  public bordeDeduccionesSuccess = false;

  public listIngresosAnalisis: MacIngresosXAnalisis[];
  public listDeduccionesAnalisis: MacDeduccionesAnalisis[];
  public listExtrasAplicables: MacExtrasAplicables[];

  public habilitaIcoOpenModalExtras: boolean = false;
  public habilitaIcoOpenModalDeducciones: boolean = false;
  public habilitaInputPromedio: boolean = false;
  
  public habilitaBtnRegistrarIngreso: boolean = false;
  public habilitaBtnActualizaIngreso: boolean = false;
  public habilitaBtnNuevoIngreso: boolean = false;

  public habilitaBtnActualizaDeduccion: boolean = false;
  public habilitaBtnRegistraDeduccion: boolean = false;
  public habilitaBtnNewDeducciones: boolean = false;

  public habilitaBtnLimpiarExtra: boolean = false;
  public habilitaBtnNewExtra: boolean = false;
  public habilitaBtnPostExtra: boolean = false;
  public habilitaBtnPutExtra: boolean = false;
  public habilitaBtnDeleteExtra: boolean = false;
  public habilitaBtnFinalizarExtra: boolean = false;

  public habilitaBtnPD: boolean = false;

  public formIngresos: UntypedFormGroup;
  public formExtras: UntypedFormGroup;
  public formDeducciones: UntypedFormGroup;

  public submittedIngresosForm: boolean = false;
  public submittedExtrasForm: boolean = false;
  public submittedDeduccionesForm: boolean = false;

  public mesesAplicablesExtras : number;
  
  get i() { return this.formIngresos.controls; }
  get e() { return this.formExtras.controls; }
  get d() { return this.formDeducciones.controls; }

  public objIngresoSeleccionado: MacIngresosXAnalisis = undefined;
  public objExtrasSeleccionado: MacExtrasAplicables = undefined;
  public objDeduccionSeleccionado: MacDeduccionesAnalisis = undefined;

  oPersona : MacPersona;
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

    this.getListasIngresos();
  }

  private getListasIngresos(){
    this.macredService.getTiposDeducciones(this.companiaObservable.id, false)
      .pipe(first())
      .subscribe({ next: (response) => { this.listTiposDeducciones = response; }});

    this.macredService.getMatrizAceptacionIngreso(this.companiaObservable.id, false)
      .pipe(first())
      .subscribe({ next: (response) => { this.matrizAceptacion = response; }});
  }

  ngOnInit(): void {

    this.srvDatosAnalisisService.personaAnalisis$.subscribe(
      persona => {
        if (persona) this.oPersona = persona;
    });

    this.srvDatosAnalisisService.analisisCapacidadPago$.subscribe(
      analisis => {
        if (analisis) this.oAnalisis = analisis;
    });

    this.srvDatosAnalisisService.listIngresosAnalisis$.subscribe(
      lista => { 
        if (lista) {
          this.listIngresosAnalisis = lista;

          this.habilitaBtnPD = true;

          this.listIngresosAnalisis = this.listIngresosAnalisis.map(element => {
            const tipo = this.listTiposIngresos.find(x => x.id === element.codigoTipoIngreso);
            return { ...element, descTipoIngreso: tipo ? tipo.descripcion : '' };
          });
        }
    });

    this.srvDatosAnalisisService.resetFormsIngresos$.subscribe(() => this.resetFormsIngresos());
    //

    this.mesesAplicablesExtras = this.srvDatosAnalisisService._globalMesesAplicaExtras;

    this.listTiposIngresos = this.srvDatosAnalisisService.listTiposIngresos;
    this.listTiposMonedas = this.srvDatosAnalisisService.listTiposMonedas;

    // this.listTiposDeducciones = this.srvDatosAnalisisService.listTiposDeducciones;
    // this.matrizAceptacion = this.srvDatosAnalisisService.listMatrizAceptacionIngreso;

    this.inicializaFormIngreso();
    this.inicializaFormExtras();
    this.inicializaFormDeducciones();
  }

  // procedimientos ingresos
  public nuevoIngreso() : void { this.inicializaFormIngreso(); }

  private inicializaFormIngreso(pingreso: MacIngresosXAnalisis = null): void {

    this.submittedIngresosForm = false;
    
    if (pingreso) {

      this.formIngresos = this.formBuilder.group({
        codigoTipoIngreso: [this.listTiposIngresos.find((x) => x.id === pingreso.codigoTipoIngreso), Validators.required],
        montoBruto: [pingreso.montoBruto, Validators.required],
        montoNeto: [pingreso.montoNeto, Validators.required],
        cargasSociales: pingreso.cargasSociales,
        impuestoRenta: pingreso.impuestoRenta,
        montoExtras: pingreso.montoExtras,
        promedioExtras: [0],
        montoDeducciones: pingreso.montoDeducciones,

        totalMontoAnalisis: this.oAnalisis.totalMontoAnalisis,
        totalIngresoBruto: this.oAnalisis.totalIngresoBruto,
        totalIngresoNeto: this.oAnalisis.totalIngresoNeto,
        totalCargaImpuestos: this.oAnalisis.totalCargaImpuestos,
        totalExtrasAplicables: this.oAnalisis.totalExtrasAplicables,
        totalDeducciones: this.oAnalisis.totalDeducciones,
      });
      this.objIngresoSeleccionado = pingreso;
      this.habilitaBtnIngresos(true);

    } else {
      
      this.formIngresos = this.formBuilder.group({
        codigoTipoIngreso: [null, Validators.required],
        montoBruto: [0, Validators.required],
        montoNeto: [0, Validators.required],
        cargasSociales: [0],
        impuestoRenta: [0],
        montoExtras: [0],
        promedioExtras: [0],
        montoDeducciones: [0],

        totalMontoAnalisis: [this.oAnalisis?.totalMontoAnalisis ?? 0],
        totalIngresoBruto: [this.oAnalisis?.totalIngresoBruto ?? 0],
        totalIngresoNeto: [this.oAnalisis?.totalIngresoNeto ?? 0],
        totalCargaImpuestos: [this.oAnalisis?.totalCargaImpuestos ?? 0],
        totalExtrasAplicables: [this.oAnalisis?.totalExtrasAplicables ?? 0],
        totalDeducciones: [this.oAnalisis?.totalDeducciones ?? 0]
      });
      this.objIngresoSeleccionado = undefined;
      this.habilitaBtnIngresos(false);
    }
  }
  private obtenerDatosFormularioIngreso(registra : boolean = true): MacIngresosXAnalisis {

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

    obj.porcentajeExtras = this.objExtrasSeleccionado?.porcentajeExtrasAplicables ?? 0;

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

  public selectIngresoAnalisis(pingreso: MacIngresosXAnalisis): void {
    
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

          // actualizar totales usuario
          let objPersonaingreso: MacPersona = {
            ...this.oPersona,

            salarioBruto: this.oAnalisis.totalIngresoBruto,
            totalSalarioNeto: this.oAnalisis.totalIngresoNeto,
            totalDeducciones: this.oAnalisis.totalDeducciones
          };
          const responsePersona = await this.srvDatosAnalisisService.actualizarPersona(objPersonaingreso);

          const analisisResponse = await this.srvDatosAnalisisService.actualizarAnalisis(this.oAnalisis);
          
          if (responsePersona.exito && analisisResponse.exito) {

            this.srvDatosAnalisisService.setAnalisisCapacidadPago(this.oAnalisis);

            this.inicializaFormIngreso();

            this.alertService.success(`Ingreso: ${response.responseMesagge} 
                                      , Análisis: ${analisisResponse.responseMesagge}
                                      , Persona: ${responsePersona.responseMesagge}`);
            this.mostrarBordeIngresos('success');

          } else { this.alertService.error(analisisResponse.responseMesagge); this.mostrarBordeIngresos('error'); }
          
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

          // actualizar totales usuario
          let objPersonaingreso: MacPersona = {
            ...this.oPersona,

            salarioBruto: this.oAnalisis.totalIngresoBruto,
            totalSalarioNeto: this.oAnalisis.totalIngresoNeto,
            totalDeducciones: this.oAnalisis.totalDeducciones
          };
          const responsePersona = await this.srvDatosAnalisisService.actualizarPersona(objPersonaingreso);

          const analisisResponse = await this.srvDatosAnalisisService.actualizarAnalisis(this.oAnalisis);

          if (responsePersona.exito && analisisResponse.exito) {

            this.oPersona = responsePersona.objetoDb;
            // this.srvDatosAnalisisService.setPersonaAnalisis(objPersonaingreso);

            this.srvDatosAnalisisService.setAnalisisCapacidadPago(this.oAnalisis);
            
            this.inicializaFormIngreso();

            this.alertService.success(`Ingreso: ${response.responseMesagge} 
                                      , Análisis: ${analisisResponse.responseMesagge}
                                      , Persona: ${responsePersona.responseMesagge}`);
            this.mostrarBordeIngresos('success');

          } else { 
            this.alertService.error(analisisResponse.responseMesagge || responsePersona.responseMesagge); 
            this.mostrarBordeIngresos('error'); 
          }
            
        } else { this.alertService.error(response.responseMesagge); }
      } catch (error: any) { this.alertService.error(error); }
    }
  }
  async deleteIngreso(ingreso: MacIngresosXAnalisis): Promise<void> {

    const dialog = this.dialogo.open(DialogoConfirmacionComponent, {
      data: `Seguro que desea eliminar el ingreso ${ingreso.id} ? 
            Se eliminaran las Extras y Deducciones relacionadas.`
    });

    const confirmado = await firstValueFrom(dialog.afterClosed());

    if (confirmado) {

      try {

        if (this.objExtrasSeleccionado) {
          const responseExtras = await this.deleteAutoExtras(this.objExtrasSeleccionado.id);

          if (!responseExtras.exito) throw new Error(responseExtras.responseMesagge);

          this.objExtrasSeleccionado = undefined;
        }

        if (this.listDeduccionesAnalisis) {
          const responseDeducciones = await this.deleteAutoDeducciones(ingreso.id);

          if (!responseDeducciones.exito) throw new Error(responseDeducciones.responseMesagge);

          this.listDeduccionesAnalisis = this.listDeduccionesAnalisis.filter(x => x.codigoIngreso !== ingreso.id);
        }

        const responseIngreso = 
          await firstValueFrom( this.macredService.deleteIngreso(ingreso.id).pipe(first()));

        if (!responseIngreso.exito) throw new Error(responseIngreso.responseMesagge);


        this.listIngresosAnalisis = this.listIngresosAnalisis.filter(m => m.id !== ingreso.id);
        if (this.listIngresosAnalisis.length === 0) this.listIngresosAnalisis = null;

        this.totalizarMontosIngreso();

        // actualizar totales usuario
        let objPersonaingreso: MacPersona = {
          ...this.oPersona,

          salarioBruto: this.oAnalisis.totalIngresoBruto,
          totalSalarioNeto: this.oAnalisis.totalIngresoNeto,
          totalDeducciones: this.oAnalisis.totalDeducciones
        };
        const responsePersona = await this.srvDatosAnalisisService.actualizarPersona(objPersonaingreso);

        if (!responsePersona.exito) throw new Error(responsePersona.responseMesagge);

        this.inicializaFormIngreso();

        this.alertService.success(responseIngreso.responseMesagge);
        this.mostrarBordeIngresos('success');
        
      } catch (error : any) { this.alertService.error(error.message); this.mostrarBordeIngresos('error'); }
    }
  }

  private totalizarMontosIngreso(): void {
    
    let totalDeducciones: number = 0;
    let totalIngresoBruto: number = 0;
    let totalCargasImpuestos: number = 0;
    let totalExtrasAplicables: number = 0;

    let totalIngresoNeto: number = 0;
    let totalIngresoAnalisis: number = 0;

    if (this.listDeduccionesAnalisis) {
      this.listDeduccionesAnalisis.forEach((deduccion) => {
        totalDeducciones += deduccion.monto;
      });
    }

    if (this.listIngresosAnalisis) {
      this.listIngresosAnalisis.forEach((ingreso) => {
        totalIngresoBruto += ingreso.montoBruto;
        totalCargasImpuestos += ingreso.cargasSociales + ingreso.impuestoRenta;

        totalExtrasAplicables += ingreso.montoExtras;
      });
    }

    totalIngresoNeto = totalIngresoBruto - totalCargasImpuestos;
    totalIngresoAnalisis = totalIngresoNeto + totalExtrasAplicables;

    this.oAnalisis.totalCargaImpuestos = totalCargasImpuestos;
    this.oAnalisis.totalDeducciones = totalDeducciones;
    this.oAnalisis.totalExtrasAplicables = totalExtrasAplicables;
    this.oAnalisis.totalIngresoBruto = totalIngresoBruto;
    this.oAnalisis.totalIngresoNeto = totalIngresoNeto;
    this.oAnalisis.totalMontoAnalisis = totalIngresoAnalisis;
  }

  // procedimientos extras
  public limpiarExtras() : void { this.inicializaFormExtras(); }

  public nuevoExtras() : void { 

    if (this.objExtrasSeleccionado) {

      this.formExtras.patchValue({ montoExtra: null });
      this.habilitaBtnExtras('nuevo');
      this.formExtras.get('montoExtra')?.enable();
      
    } else { this.inicializaFormExtras(); }
  }

  private inicializaFormExtras(pextras : MacExtrasAplicables = null) : void {

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

      this.listExtrasAplicables = null;
      this.objExtrasSeleccionado = undefined;
      this.habilitaBtnExtras('actualiza');
    }
  }
  private obtenerDatosFormularioExtras(registra : boolean = true): MacExtrasAplicables {

    // this.alertService.clear();
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

  public putExtras() : void { this.calcularExtras(false); }
  public calcularExtras(registra : boolean = true) : void {

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

      // var coeficientePorcentual: number  = 0.0;

      if (!this.listExtrasAplicables) this.listExtrasAplicables = [];

      if (this.listExtrasAplicables.length >= this.mesesAplicablesExtras) {
        this.alertService.warn(
          `No puede registrar más de ${this.mesesAplicablesExtras} 
          extras correspondientes al parámetro MESES_APLICABLES_EXTRAS`
        ); return;
      }

      this.listExtrasAplicables.push(objExtra);
      cantRegistrosExtras = this.listExtrasAplicables.length;

      sumatoriaMontoExtras = objExtra.sumatoriaExtras + objExtra.montoExtras;
      objExtra.sumatoriaExtras = sumatoriaMontoExtras;

      if (cantRegistrosExtras == 1) {

        objExtra.desviacionEstandar = 0;
        objExtra.coeficienteVarianza = 0;

        objExtra.promedioExtrasAplicables = objExtra.sumatoriaExtras;
        objExtra.porcentajeExtrasAplicables = objExtra.sumatoriaExtras === objExtra.montoExtras ? 100 : 0;

      } else {

        promedioExtras = objExtra.sumatoriaExtras / this.mesesAplicablesExtras;
        // promedioExtras = objExtra.sumatoriaExtras / cantRegistrosExtras;

        this.listExtrasAplicables.forEach((extra) => {
          potenciaSaldo += Math.pow(extra.montoExtras - promedioExtras, 2);
        });

        objExtra.desviacionEstandar = Math.sqrt(
          potenciaSaldo / (this.mesesAplicablesExtras - 1)
          // potenciaSaldo / (cantRegistrosExtras - 1)
        );

        objExtra.coeficienteVarianza = objExtra.desviacionEstandar / promedioExtras;
        objExtra.coeficienteVarianza = objExtra.coeficienteVarianza >= 1 ? 1 : objExtra.coeficienteVarianza;
        // objExtra.coeficienteVarianza = (objExtra.desviacionEstandar / promedioExtras) * 100;

        objExtra.promedioExtrasAplicables = promedioExtras;

        objExtra.porcentajeExtrasAplicables = (100 - objExtra.coeficienteVarianza);
        // objExtra.promedioExtrasAplicables * (1 - objExtra.coeficienteVarianza / 100);
      }

      // if (cantRegistrosExtras == 1) {

      //   objExtra.desviacionEstandar = 0;
      //   objExtra.coeficienteVarianza = 0;

      //   objExtra.promedioExtrasAplicables = objExtra.sumatoriaExtras;
      //   objExtra.porcentajeExtrasAplicables = objExtra.sumatoriaExtras;

      // } else {

      //   promedioExtras = objExtra.sumatoriaExtras / cantRegistrosExtras;

      //   this.listExtrasAplicables.forEach((extra) => {
      //     potenciaSaldo += Math.pow(extra.montoExtras - promedioExtras, 2);
      //   });

      //   objExtra.desviacionEstandar = Math.sqrt(
      //     potenciaSaldo / (cantRegistrosExtras - 1)
      //   );

      //   objExtra.coeficienteVarianza = (objExtra.desviacionEstandar / promedioExtras) * 100;

      //   objExtra.promedioExtrasAplicables = promedioExtras;

      //   objExtra.porcentajeExtrasAplicables = 
      //     objExtra.promedioExtrasAplicables * (1 - objExtra.coeficienteVarianza / 100);
      // }
      
      this.listExtrasAplicables[cantRegistrosExtras-1] = objExtra;
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
        
        this.habilitaBtnFinalizarExtra = true;
        this.habilitaBtnLimpiarExtra = true;
      
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

  private calculaMontoExtrasFactor(promedioExtras : number, coeficienteVarianza : number) : number {

    let coeficientePorcentual: number  = 0.0;
    let factorAceptacion : number = 0.0;

    let montoExtrasFactor : number = 0.0;

    coeficientePorcentual = coeficienteVarianza * 100;

    this.matrizAceptacion.forEach(element => {
      
      if (element.rangoDesviacion1 <= coeficientePorcentual
          && element.rangoDesviacion2 >= coeficientePorcentual)  factorAceptacion = element.factor;
    });

    montoExtrasFactor = promedioExtras * factorAceptacion;
    return montoExtrasFactor;
  }

  async finalizaCalculoExtras(pobjActualiza : MacListaExtras = null): Promise<void> {

    this.submittedExtrasForm = false;

    this.formExtras.get('montoExtra')?.disable();
    this.habilitaBtnExtras('finaliza');

    this.habilitaInputPromedio = true;

    try {

      // put extras
      if (pobjActualiza) {

        const response = await this.srvDatosAnalisisService.actualizarExtras(this.objExtrasSeleccionado, pobjActualiza);

        if (response.exito) {

          this.objExtrasSeleccionado = response.objetoDb;

          this.alertService.success( response.responseMesagge );
          this.mostrarBordeExtras('success');

        } else { this.alertService.error(response.responseMesagge); this.mostrarBordeExtras('error'); }

      // post extras
      } else {

        const listaExtras = 
          this.listExtrasAplicables.map(e => Object.assign(new MacListaExtras(), {
            monto: e.montoExtras,
            desviacion: e.desviacionEstandar,
            coeficiente: e.coeficienteVarianza,
            porcentaje: e.porcentajeExtrasAplicables,
            promedio: e.promedioExtrasAplicables
          }));

          const response = await this.srvDatosAnalisisService.registrarExtras(this.objExtrasSeleccionado, listaExtras);

          if (response.exito) {

            this.objExtrasSeleccionado = response.objetoDb;
            $('#extrasModal').modal('hide');

            this.alertService.success( response.responseMesagge );

          } else { this.alertService.error(response.responseMesagge); this.mostrarBordeExtras('error'); }
      }

      this.getExtrasAnalisis();

    } catch (error: any) { this.alertService.error(error); this.mostrarBordeExtras('error'); }
  }

  public deleteExtras(): void {

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
              
              this.habilitaInputPromedio = false;
              this.inicializaFormExtras();

              this.formIngresos.patchValue({ montoExtras: 0, promedioExtras: 0 });

              $('#extrasModal').modal('hide');

              this.alertService.success(response.responseMesagge);

            } else { this.alertService.error(response.responseMesagge); }
          });

      } else { return; }
    });
  }

  private getExtrasAnalisis(): void {

    if (this.oAnalisis && this.objIngresoSeleccionado?.id) {
      
      this.macredService.getExtrasAplicablesIngreso(this.oAnalisis.codigoAnalisis,
                                                    this.objIngresoSeleccionado.id)
        .pipe(first())
        .subscribe((responseExtras) => {

          if (responseExtras) {
            
            this.macredService.getListaExtrasAplicables(responseExtras.id)
              .pipe(first())
              .subscribe((responseLista) => {

                this.habilitaInputPromedio = true;

                let sumatoriaExtras = 0;

                this.listExtrasAplicables = responseLista.map(element => {
                  sumatoriaExtras += element.monto;
                  return {
                    codigoCompania: this.companiaObservable.id,
                    codigoAnalisis: this.oAnalisis.codigoAnalisis,
                    codigoIngreso: this.objIngresoSeleccionado.id,
                    montoExtras: element.monto,
                    desviacionEstandar: element.desviacion,
                    coeficienteVarianza: element.coeficiente,
                    porcentajeExtrasAplicables: element.porcentaje,
                    promedioExtrasAplicables: element.promedio,
                    sumatoriaExtras 
                  } as MacExtrasAplicables;
                });

                responseExtras.sumatoriaExtras = sumatoriaExtras;
                responseExtras.montoExtras = null;
                this.inicializaFormExtras(responseExtras);

                const montoExtrasFactor : number = 
                  this.calculaMontoExtrasFactor(responseExtras.promedioExtrasAplicables,
                                                responseExtras.coeficienteVarianza);

                this.formIngresos.patchValue({
                  montoExtras: parseFloat( montoExtrasFactor.toFixed(2) ),
                  promedioExtras : parseFloat( this.objExtrasSeleccionado.promedioExtrasAplicables.toFixed(2) )
                });
              });

          } else { 
            this.listExtrasAplicables = undefined; 
            this.habilitaInputPromedio = false; 
            this.inicializaFormExtras();
          }

        });
    }
  }

  private async deleteAutoExtras(idExtras: number): Promise<ResponseMessage> {
    try {
      const response = 
        await firstValueFrom( this.macredService.deleteExtrasAplicables(idExtras).pipe(first()));
      
        return response;

    } catch (error) { return { exito: false, responseMesagge: 'Error al eliminar extras.' }; }
  }


  // procedimientos deducciones
  public nuevoDeducciones() : void { this.inicializaFormDeducciones(); }

  private inicializaFormDeducciones(pdeduccion : MacDeduccionesAnalisis = null) : void {

    this.submittedDeduccionesForm = false;

    if (pdeduccion) {

      this.habilitaBtnActualizaDeduccion = true;
      this.habilitaBtnNewDeducciones = true;
      this.habilitaBtnRegistraDeduccion = false;
      
      this.formDeducciones = this.formBuilder.group({
        codigoTipoDeduccion: [this.listTiposDeducciones.find(
          (x) => x.id === pdeduccion.codigoTipoDeduccion), Validators.required],
        codigoTipoMoneda: [this.listTiposMonedas.find(
          (x) => x.id === pdeduccion.codigoMoneda), Validators.required],
        tipoCambio: [pdeduccion.tipoCambio, Validators.required],
        montoDeduccion: [pdeduccion.monto, Validators.required],
      });

      this.objDeduccionSeleccionado = pdeduccion;
      
    } else {

      this.habilitaBtnActualizaDeduccion = false;
      this.habilitaBtnNewDeducciones = false;
      this.habilitaBtnRegistraDeduccion = true;

      this.formDeducciones = this.formBuilder.group({
        codigoTipoDeduccion: [null, Validators.required],
        codigoTipoMoneda: [this.listTiposMonedas.find(
          (x) => x.id === this.srvDatosAnalisisService._globalCodMonedaPrincipal), Validators.required],
        tipoCambio: [1, Validators.required],
        montoDeduccion: [null, Validators.required],
      });

      this.objDeduccionSeleccionado = undefined;
    }
  }
  private obtenerDatosFormularioDeducciones(registra : boolean = true) : MacDeduccionesAnalisis {

    // this.alertService.clear();
    this.submittedDeduccionesForm = true;

    if (this.formDeducciones.invalid) return null;

    const { codigoTipoDeduccion, 
            codigoTipoMoneda,
            tipoCambio, 
            montoDeduccion} = this.formDeducciones.controls;

    if (montoDeduccion.value <= 0) {
      this.formDeducciones.controls['montoDeduccion'].setErrors({ error: true });
      return null;
    }

    var obj: MacDeduccionesAnalisis = new MacDeduccionesAnalisis();

    obj.codigoAnalisis = this.oAnalisis.codigoAnalisis;
    obj.codigoIngreso = this.objIngresoSeleccionado.id;

    obj.codigoTipoDeduccion = codigoTipoDeduccion.value.id;
    obj.codigoMoneda = codigoTipoMoneda.value.id;
    obj.tipoCambio = tipoCambio.value;
    obj.monto = montoDeduccion.value;

    if (registra) {

      obj.codigoCompania = this.companiaObservable.id;
      obj.adicionadoPor = this.userObservable.identificacion; 
      obj.fechaAdicion = this.today;

    } else {

      obj.id = this.objDeduccionSeleccionado.id;
      obj.modificadoPor = this.userObservable.identificacion; 
      obj.fechaModificacion = this.today;

      this.oAnalisis.modificadoPor = this.userObservable.identificacion;
      this.oAnalisis.fechaModificacion = this.today;
    }
    return obj;
  }

  public selectDeduccionAnalisis(deduccion: MacDeduccionesAnalisis): void { this.inicializaFormDeducciones(deduccion); }
  
  async postDeducciones(): Promise<void> {

    var deduccion: MacDeduccionesAnalisis = this.obtenerDatosFormularioDeducciones(true);

    if (deduccion) {

      try {
        const response = await this.srvDatosAnalisisService.registrarDeducciones(deduccion);

        if (response.exito) {

            this.getDeduccionesAnalisis();
            this.inicializaFormDeducciones();

            this.alertService.success(response.responseMesagge);
            this.mostrarBordeDeducciones('success');

        } else { this.alertService.error(response.responseMesagge); this.mostrarBordeDeducciones('error'); }
      } catch (error: any) { this.alertService.error(error); }
    }
  }
  async putDeducciones(): Promise<void> {

    var deduccion: MacDeduccionesAnalisis = this.obtenerDatosFormularioDeducciones(false);

    if (deduccion) {

      try {
        const response = await this.srvDatosAnalisisService.actualizarDeducciones(deduccion);

        if (response.exito) {
          
          this.getDeduccionesAnalisis();
          this.inicializaFormDeducciones();

          this.alertService.success(response.responseMesagge);
          this.mostrarBordeDeducciones('success');

        } else { this.alertService.error(response.responseMesagge); this.mostrarBordeDeducciones('error'); }
      } catch (error: any) { this.alertService.error(error); }
    }
  }
  public deleteDeducciones(deduccion: MacDeduccionesAnalisis): void {
    // this.alertService.clear();

    this.dialogo.open(DialogoConfirmacionComponent, {
      data: `Seguro que desea eliminar la deducción ${deduccion.id}, 
            del ingreso ${this.objIngresoSeleccionado.id} ?`,
    })
    .afterClosed()
    .subscribe((confirmado: Boolean) => {
      if (confirmado) {

        this.macredService.deleteDeduccion(deduccion.id)
          .pipe(first())
          .subscribe((response) => {

            if (response.exito) {
              
              this.getDeduccionesAnalisis();
              this.inicializaFormDeducciones();

              this.alertService.success(response.responseMesagge);
              this.mostrarBordeDeducciones('success');

            } else { this.alertService.error(response.responseMesagge); this.mostrarBordeDeducciones('error'); }
          });
      } else { return; }
    });
  }

  private getDeduccionesAnalisis(): void {

    var deduccionesAnalisis: number = 0;
    var deduccionesIngreso: number = 0;

    if (this.oAnalisis) {
      
      this.macredService.getDeduccionesAnalisis(this.oAnalisis.codigoAnalisis)
        .pipe(first())
        .subscribe((tresponse) => {

          if (tresponse?.length) {
            tresponse.forEach((element) => { 

              deduccionesAnalisis += element.monto;
              this.formIngresos.patchValue({ totalDeducciones: deduccionesAnalisis });

              element.descTipoIngreso = 
                this.listTiposDeducciones.find((x) => x.id === element.codigoTipoDeduccion).descripcion;
              element.descTipoMoneda = 
                this.listTiposMonedas.find((x) => x.id === element.codigoMoneda).descripcion;
            });

            this.listDeduccionesAnalisis = tresponse;
          }
          else{ this.listDeduccionesAnalisis = null; }

          if (this.objIngresoSeleccionado) {
            
            this.macredService.getDeduccionesAnalisisIngreso(this.oAnalisis.codigoAnalisis, this.objIngresoSeleccionado.id)
              .pipe(first())
              .subscribe((dresponse) => {

                if (dresponse?.length) dresponse.forEach((element) => { deduccionesIngreso += element.monto; });

                this.formIngresos.patchValue({ montoDeducciones: deduccionesIngreso });
                  
              });
          }
        });
    }
  }

  private async deleteAutoDeducciones(pidIngreso: number): Promise<ResponseMessage> {
    try {
      const response = 
        await firstValueFrom( this.macredService.deleteDeduccionesIngreso(pidIngreso).pipe(first()));
      
        return response;

    } catch (error) { return { exito: false, responseMesagge: 'Error al eliminar extras.' }; }
  }
  

  // generales

  public openExtrasModal(): void {

    this.submittedExtrasForm = false;

    if (this.objExtrasSeleccionado) this.formExtras.get('montoExtra')?.disable();

    if (this.objExtrasSeleccionado && this.habilitaBtnPutExtra) this.habilitaBtnExtras('registra');

    $('#extrasModal').modal({ backdrop: 'static', keyboard: false }, 'show');
  }
  public openDeduccionesModal(): void {
    $('#deduccionesModal').modal({ backdrop: 'static', keyboard: false }, 'show');
  }

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
        this.habilitaBtnFinalizarExtra = false;
        this.habilitaBtnLimpiarExtra = false;
        break;

      case 'nuevo':
        this.habilitaBtnPutExtra = true;
        this.habilitaBtnNewExtra = false;
        this.habilitaBtnDeleteExtra = false;
        break;

      case 'finaliza':

        this.habilitaBtnNewExtra = true;
        this.habilitaBtnDeleteExtra = true;
        this.habilitaBtnFinalizarExtra = false;
        this.habilitaBtnLimpiarExtra = false;
        this.habilitaBtnPostExtra = false;
        this.habilitaBtnPutExtra = false;
        break;
    
      default:
        break;
    }
  }
  private habilitaBtnIngresos(registra : boolean) : void {

    if (registra) {

      this.habilitaBtnNuevoIngreso = true;
      this.habilitaBtnPD = true;
      this.habilitaBtnActualizaIngreso = true;
      this.habilitaIcoOpenModalExtras = true;
      this.habilitaIcoOpenModalDeducciones = true;
      this.habilitaBtnRegistrarIngreso = false;
    }
    else {

      this.habilitaInputPromedio = false;

      this.habilitaBtnNuevoIngreso = false;
      this.habilitaBtnPD = false;
      this.habilitaBtnActualizaIngreso = false;
      this.habilitaIcoOpenModalExtras = false;
      this.habilitaIcoOpenModalDeducciones = false;
      this.habilitaBtnRegistrarIngreso = true;
    }
  }

  private resetFormsIngresos() {
    this.inicializaFormIngreso();
    this.inicializaFormExtras();
    this.inicializaFormDeducciones();
  }

  private mostrarBordeIngresos(tipo: 'success' | 'error') {
    this.bordeSuccessIngresos = tipo === 'success';
    this.bordeErrorIngresos = tipo === 'error';
    setTimeout(() => { this.bordeSuccessIngresos = false; this.bordeErrorIngresos = false; }, 2000);
  }
  private mostrarBordeExtras(tipo: 'success' | 'error') {
    this.bordeExtrasSuccess = tipo === 'success';
    this.bordeExtrasError = tipo === 'error';
    setTimeout(() => { this.bordeExtrasSuccess = false; this.bordeExtrasError = false; }, 2000);
  }
  private mostrarBordeDeducciones(tipo: 'success' | 'error') {
    this.bordeDeduccionesSuccess = tipo === 'success';
    this.bordeDeduccionesError = tipo === 'error';
    setTimeout(() => { this.bordeDeduccionesSuccess = false; this.bordeDeduccionesError = false; }, 2000);
  }

  public handleOnPD(): void { this.onPD.emit(); }
}
