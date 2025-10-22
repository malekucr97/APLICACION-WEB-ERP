import { Injectable } from '@angular/core';
import { Compania, Module, ResponseMessage, User } from '@app/_models';
import {  MacAnalisisCapacidadPago,
          MacEstadoCivil,
          MacExtrasAplicables,
          MacIngresosXAnalisis,
          MacListaExtras,
          MacMatrizAceptacionIngreso,
          MacModeloAnalisis,
          MacNivelCapacidadPago,
          MacPersona,
          MacTipoDeducciones,
          MacTipoFormaPagoAnalisis,
          MacTipoGenerador,
          MacTipoIngreso,
          MacTipoIngresoAnalisis,
          MacTiposMoneda,
          ModelosPD } from '@app/_models/Macred';
import { MacCategoriaCredito } from '@app/_models/Macred/CategoriaCredito';
import { MacCondicionLaboral } from '@app/_models/Macred/CondicionLaboral';
import { MacTipoAsociado } from '@app/_models/Macred/TipoAsociado';
import { MacTipoGenero } from '@app/_models/Macred/TipoGenero';
import { MacTipoHabitacion } from '@app/_models/Macred/TipoHabitacion';
import { AccountService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { BehaviorSubject, firstValueFrom, forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SrvDatosAnalisisService {

  private _analisisCapacidadPago = new BehaviorSubject<MacAnalisisCapacidadPago | null>(null);
  analisisCapacidadPago$ = this._analisisCapacidadPago.asObservable();
  setAnalisisCapacidadPago(analisis: MacAnalisisCapacidadPago = null) { this._analisisCapacidadPago.next(analisis); }
  getAnalisisCapacidadPago(): MacAnalisisCapacidadPago | null { return this._analisisCapacidadPago.value; }

  // _analisisCapacidadpago: MacAnalisisCapacidadPago;
  _personaAnalisis: MacPersona;

  private _listIngresosAnalisis = new BehaviorSubject<MacIngresosXAnalisis[] | null>(null);
  listIngresosAnalisis$ = this._listIngresosAnalisis.asObservable();
  setListIngresosAnalisis(lista: MacIngresosXAnalisis[] = null) { this._listIngresosAnalisis.next(lista); }
  getListIngresosAnalisis(): MacIngresosXAnalisis[] | null { return this._listIngresosAnalisis.value; }

  listTipoGenero: MacTipoGenero[];
  // lstEstadoCivil: MacEstadoCivil[];
  // listTipoHabitaciones: MacTipoHabitacion[];
  lstModelosPD: ModelosPD[] = [];

  // ## -- objetos suscritos -- ## //
  private userObservable: User;
  private moduleObservable: Module;
  private companiaObservable: Compania;
  // ## -- ----------------- -- ## //

  // listas cargadas desde analisis-asociados
  listTiposAsociados: MacTipoAsociado[];
  listCategoriasCreditos: MacCategoriaCredito[];
  listEstadosCiviles: MacEstadoCivil[];
  listCondicionesLaborales: MacCondicionLaboral[];
  listTiposHabitaciones: MacTipoHabitacion[];


  listTipoIngresoAnalisis: MacTipoIngresoAnalisis[];
  listTiposMonedas: MacTiposMoneda[];
  listTipoFormaPagoAnalisis: MacTipoFormaPagoAnalisis[];
  listModelosAnalisis: MacModeloAnalisis[];
  listNivelesCapacidadpago: MacNivelCapacidadPago[];
  listTiposGeneradores: MacTipoGenerador[];

  listTiposIngresos: MacTipoIngreso[];
  listTiposDeducciones: MacTipoDeducciones[];
  listMatrizAceptacionIngreso: MacMatrizAceptacionIngreso[];

  _globalCodMonedaPrincipal: number;
  _globalMesesAplicaExtras: number;

  private _listasCargadas$ = new BehaviorSubject<boolean>(false);
  listasCargadas$ = this._listasCargadas$.asObservable();

  constructor(private macredService: MacredService,
              private accountService: AccountService) {

    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
    this.companiaObservable = this.accountService.businessValue;

    this.cargarDatosPD();
  }

  // analisis
  async actualizarAnalisis(analisis: MacAnalisisCapacidadPago): Promise<ResponseMessage> {
    try {

      return await firstValueFrom( this.macredService.putAnalisisCapPago(analisis) );

    } catch (error: any) { throw new Error(`HTTP Error. Detalle: ${error.message || error}`); }
  }
  async registrarAnalisis(analisis: MacAnalisisCapacidadPago): Promise<ResponseMessage> {
    try {

      return await firstValueFrom( this.macredService.postAnalisisCapPago(analisis) );

    } catch (error: any) { throw new Error(`HTTP Error. Detalle: ${error.message || error}`); }
  }

  // ingresos
  async actualizarIngreso(ingreso: MacIngresosXAnalisis): Promise<ResponseMessage> {
    try {

      return await firstValueFrom( this.macredService.putIngresoAnalisis(ingreso) );

    } catch (error: any) { throw new Error(`HTTP Error. Detalle: ${error.message || error}`); }
  }
  async registrarIngreso(ingreso: MacIngresosXAnalisis): Promise<ResponseMessage> {
    try {

      return await firstValueFrom( this.macredService.postIngresoAnalisis(ingreso) );

    } catch (error: any) { throw new Error(`HTTP Error. Detalle: ${error.message || error}`); }
  }

  // extras
    async actualizarExtras(extras: MacExtrasAplicables, listExtras: MacListaExtras): Promise<ResponseMessage> {
    try {

      return await firstValueFrom( this.macredService.putExtrasAplicables(extras, listExtras) );

    } catch (error: any) { throw new Error(`HTTP Error. Detalle: ${error.message || error}`); }
  }
  async registrarExtras(extras: MacExtrasAplicables, listExtras: MacListaExtras[]): Promise<ResponseMessage> {
    try {

      return await firstValueFrom( this.macredService.postExtrasAplicables(extras, listExtras) );

    } catch (error: any) { throw new Error(`HTTP Error. Detalle: ${error.message || error}`); }
  }

  
  public actualizaListaIngresosAnalisis() : void {

    if (this.getAnalisisCapacidadPago()) {

      this.macredService.getIngresosAnalisis(this.getAnalisisCapacidadPago().codigoAnalisis)
      .pipe(first())
      .subscribe((response) => { this.setListIngresosAnalisis(response); });
    }
    else { this.setListIngresosAnalisis(); }
  }

  //#region PD

  private cargarDatosPD() {
    this.macredService
      .getTiposGenerosCompania(this.companiaObservable.id)
      .pipe(first())
      .subscribe((response) => {
        this.listTipoGenero = response;
      });

    this.macredService
      .getPDModelos(this.userObservable.empresa)
      .pipe(first())
      .subscribe((lstModelosPD) => {
        this.lstModelosPD = lstModelosPD;
      });
  }

  //#endregion
}

  // private cargaDatosAnalisis() : void {

  //   // info analisis
  //   this.macredService.getTiposAsociados()
  //     .pipe(first())
  //     .subscribe({ next: (response) => { if (response?.length) this.listTiposAsociados = response; }});

  //   this.macredService.getCategoriasCreditosCompania(this.userObservable.empresa)
  //     .pipe(first())
  //     .subscribe({ next: (response) => { if (response?.length) this.listCategoriasCreditos = response; }});

  //   this.macredService.getEstadosCiviles()
  //     .pipe(first())
  //     .subscribe({ next: (response) => { if (response?.length) this.listEstadosCiviles = response; }});

  //   this.macredService.getCondicionesLaboralesCompania(this.companiaObservable.id)
  //     .pipe(first())
  //     .subscribe({ next: (response) => { if (response?.length) this.listCondicionesLaborales = response; }});

  //   this.macredService.getTiposHabitacionesCompania(this.companiaObservable.id)
  //     .pipe(first())
  //     .subscribe({ next: (response) => { if (response?.length) this.listTiposHabitaciones = response; }});

  //     // info datos analisis
  //   this.macredService.getTiposIngresoAnalisis(this.companiaObservable.id)
  //     .pipe(first())
  //     .subscribe({ next: (response) => { if (response?.length) this.listTipoIngresoAnalisis = response; }});

  //   this.macredService.getTiposMonedas(this.companiaObservable.id)
  //     .pipe(first())
  //     .subscribe({ next: (response) => { if (response?.length) this.listTiposMonedas = response; }});

  //   this.macredService.getTiposFormaPagoAnalisis(this.companiaObservable.id)
  //     .pipe(first())
  //     .subscribe({ next: (response) => { if (response?.length) this.listTipoFormaPagoAnalisis = response; }});

  //   this.macredService.getModelosCalificacionActivos()
  //     .pipe(first())
  //     .subscribe({ next: (response) => { if (response?.length) this.listModelosAnalisis = response; }});

  //   this.macredService.getNivelesCapacidadPago(false)
  //     .pipe(first())
  //     .subscribe({ next: (response) => { if (response?.length) this.listNivelesCapacidadpago = response; }});

  //   this.macredService.getTiposGenerador(this.companiaObservable.id, false)
  //     .pipe(first())
  //     .subscribe({ next: (response) => { if (response?.length) this.listTiposGeneradores = response; }});

  //   // info ingresos
  //   this.macredService.getTiposIngresos(this.companiaObservable.id, false)
  //     .pipe(first())
  //     .subscribe({ next: (response) => { if (response?.length) this.listTiposIngresos = response; }});

  //   this.macredService.getTiposDeducciones(this.companiaObservable.id, false)
  //     .pipe(first())
  //     .subscribe({ next: (response) => { if (response?.length) this.listTiposDeducciones = response; }});

  //   this.macredService.getMatrizAceptacionIngreso(this.companiaObservable.id, false)
  //     .pipe(first())
  //     .subscribe({ next: (response) => { if (response?.length) this.listMatrizAceptacionIngreso = response; }});

  //   // info parametros generales
  //   this.macredService.GetParametroGeneralVal1('COD_MONEDA_PRINCIPAL', true)
  //     .pipe(first())
  //     .subscribe({ next: (response) => { this._globalCodMonedaPrincipal = +response; }});
    
  //   this.macredService.GetParametroGeneralVal1('MESES_APLICABLES_EXTRAS', true)
  //     .pipe(first())
  //     .subscribe({ next: (response) => { this._globalMesesAplicaExtras = +response; }});
  // }