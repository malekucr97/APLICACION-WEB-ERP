import { Injectable } from '@angular/core';
import { Compania, Module, ResponseMessage, User } from '@app/_models';
import {  AnalisisHistoricoPD, MacAnalisisCapacidadPago,
          MacDeduccionesAnalisis,
          MacEscenariosRiesgos,
          MacEstadoCivil,
          MacExtrasAplicables,
          MacInformacionCreditoPersona,
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
          ModelosPD, 
          ScoringFlujoCajaLibre} from '@app/_models/Macred';
import { MacCategoriaCredito } from '@app/_models/Macred/CategoriaCredito';
import { MacCondicionLaboral } from '@app/_models/Macred/CondicionLaboral';
import { MacModeloCalificacion } from '@app/_models/Macred/ModeloCalificacion';
import { Scoring } from '@app/_models/Macred/Scoring';
import { MacTipoAsociado } from '@app/_models/Macred/TipoAsociado';
import { MacTipoGenero } from '@app/_models/Macred/TipoGenero';
import { MacTipoHabitacion } from '@app/_models/Macred/TipoHabitacion';
import { AccountService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SrvDatosAnalisisService {

  private _personaAnalisis = new BehaviorSubject<MacPersona | null>(null);
  personaAnalisis$ = this._personaAnalisis.asObservable();
  setPersonaAnalisis(persona: MacPersona = null) { this._personaAnalisis.next(persona); }
  getPersonaAnalisis(): MacPersona | null { return this._personaAnalisis.value; }

  private _creditoAnalisis = new BehaviorSubject<MacInformacionCreditoPersona | null>(null);
  creditoAnalisis$ = this._creditoAnalisis.asObservable();
  setCreditoAnalisis(credito: MacInformacionCreditoPersona = null) { this._creditoAnalisis.next(credito); }
  getCreditoAnalisis(): MacInformacionCreditoPersona | null { return this._creditoAnalisis.value; }

  private _analisisCapacidadPago = new BehaviorSubject<MacAnalisisCapacidadPago | null>(null);
  analisisCapacidadPago$ = this._analisisCapacidadPago.asObservable();
  setAnalisisCapacidadPago(analisis: MacAnalisisCapacidadPago = null) { this._analisisCapacidadPago.next(analisis); }
  getAnalisisCapacidadPago(): MacAnalisisCapacidadPago | null { return this._analisisCapacidadPago.value; }

  private _fclAnalisis = new BehaviorSubject<ScoringFlujoCajaLibre | null>(null);
  fclAnalisis$ = this._fclAnalisis.asObservable();
  setFclAnalisis(fcl: ScoringFlujoCajaLibre = null) { this._fclAnalisis.next(fcl); }
  getFclAnalisis(): ScoringFlujoCajaLibre | null { return this._fclAnalisis.value; }

  // _personaAnalisis: MacPersona;

  private _listIngresosAnalisis = new BehaviorSubject<MacIngresosXAnalisis[] | null>(null);
  listIngresosAnalisis$ = this._listIngresosAnalisis.asObservable();
  setListIngresosAnalisis(lista: MacIngresosXAnalisis[] = null) { this._listIngresosAnalisis.next(lista); }
  getListIngresosAnalisis(): MacIngresosXAnalisis[] | null { return this._listIngresosAnalisis.value; }

  private resetFormsIngresosSubject = new Subject<void>();
  resetFormsIngresos$ = this.resetFormsIngresosSubject.asObservable();


  // ## -- objetos suscritos -- ## //
  private userObservable: User;
  private moduleObservable: Module;
  private companiaObservable: Compania;
  // ## -- ----------------- -- ## //

  listTiposAsociados: MacTipoAsociado[];
  listEstadosCiviles: MacEstadoCivil[];
  listTiposHabitaciones: MacTipoHabitacion[];

  // listCategoriasCreditos: MacCategoriaCredito[];
  listCondicionesLaborales: MacCondicionLaboral[];

  listTipoAnalisis: MacTipoIngresoAnalisis[];
  listTiposMonedas: MacTiposMoneda[];
  
  // listas datos analisis
  listModelosAnalisis: MacModeloAnalisis[];
  listTipoFormaPagoAnalisis: MacTipoFormaPagoAnalisis[];
  listModelosCalificacionAnalisis: MacModeloCalificacion[];
  listNivelesCapacidadpago: MacNivelCapacidadPago[];
  listTiposGeneradores: MacTipoGenerador[];

  listTiposIngresos: MacTipoIngreso[];
  // listTiposDeducciones: MacTipoDeducciones[];
  // listMatrizAceptacionIngreso: MacMatrizAceptacionIngreso[];

  // listas independiente
  listEscenariosEstres: MacEscenariosRiesgos[];

  // PD
  listTipoGenero: MacTipoGenero[];
  lstModelosPD: ModelosPD[] = [];

  _globalCodMonedaPrincipal: number;
  _globalMesesAplicaExtras: number;
  _constantePD: string;

  // private _listasCargadas$ = new BehaviorSubject<boolean>(false);
  // listasCargadas$ = this._listasCargadas$.asObservable();

  constructor(private macredService: MacredService,
              private accountService: AccountService) {

    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
    this.companiaObservable = this.accountService.businessValue;

    this.cargarDatosPD();
  }

  triggerResetFormsIngreso() { this.resetFormsIngresosSubject.next(); }

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

  // deducciones
  async actualizarDeducciones(deduccion: MacDeduccionesAnalisis): Promise<ResponseMessage> {
    try {
      return await firstValueFrom( this.macredService.putDeduccionAnalisis(deduccion) );

    } catch (error: any) { throw new Error(`HTTP Error. Detalle: ${error.message || error}`); }
  }
  async registrarDeducciones(deduccion: MacDeduccionesAnalisis): Promise<ResponseMessage> {
    try {
      return await firstValueFrom( this.macredService.postDeduccionesAnalisis(deduccion) );

    } catch (error: any) { throw new Error(`HTTP Error. Detalle: ${error.message || error}`); }
  }

  // persona
  async actualizarPersona(persona: MacPersona): Promise<ResponseMessage> {
    try {
      return await firstValueFrom( this.macredService.putPersona(persona) );

    } catch (error: any) { throw new Error(`HTTP Error. Detalle: ${error.message || error}`); }
  }
  // credito
  async actualizarCredito(credito: MacInformacionCreditoPersona): Promise<ResponseMessage> {
    try {
      return await firstValueFrom( this.macredService.putInfoCreditoPersona(credito) );

    } catch (error: any) { throw new Error(`HTTP Error. Detalle: ${error.message || error}`); }
  }

  // PD
  async registrarHistoricoPD(historico: AnalisisHistoricoPD): Promise<ResponseMessage> {
    try {
      return await firstValueFrom( this.macredService.postAnalisisHistoricoPD(historico) );

    } catch (error: any) { throw new Error(`HTTP Error. Detalle: ${error.message || error}`); }
  }
  async actualizarHistoricoPD(historico: AnalisisHistoricoPD): Promise<ResponseMessage> {
    try {
      return await firstValueFrom( this.macredService.putAnalisisHistoricoPD(historico) );

    } catch (error: any) { throw new Error(`HTTP Error. Detalle: ${error.message || error}`); }
  }

  // scoring
  async registrarScoring(scoring: Scoring): Promise<ResponseMessage> {
    try {
      return await firstValueFrom( this.macredService.postScoring(scoring) );

    } catch (error: any) { throw new Error(`HTTP Error. Detalle: ${error.message || error}`); }
  }
  async actualizarScoring(scoring: Scoring): Promise<ResponseMessage> {
    try {
      return await firstValueFrom( this.macredService.putScoring(scoring) );

    } catch (error: any) { throw new Error(`HTTP Error. Detalle: ${error.message || error}`); }
  }

  // fcl
  async registrarFCL(fcl: ScoringFlujoCajaLibre): Promise<ResponseMessage> {
    try {
      return await firstValueFrom( this.macredService.postFlujoCajaLibre(fcl) );

    } catch (error: any) { throw new Error(`HTTP Error. Detalle: ${error.message || error}`); }
  }
  async actualizarFCL(fcl: ScoringFlujoCajaLibre): Promise<ResponseMessage> {
    try {
      return await firstValueFrom( this.macredService.putFlujoCajaLibre(fcl) );

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
    this.macredService.getTiposGeneros()
      .pipe(first())
      .subscribe((response) => { this.listTipoGenero = response; });

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