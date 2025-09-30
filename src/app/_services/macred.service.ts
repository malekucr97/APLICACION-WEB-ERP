import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Compania, Module, ResponseMessage, User } from '@app/_models';
import { environment } from '@environments/environment';
import { MacInformacionCreditoPersona, MacPersona } from '@app/_models/Macred/Persona';
import { MacTipoIngresoAnalisis } from '@app/_models/Macred/TipoIngresoAnalisis';
import { MacTipoFormaPagoAnalisis } from '@app/_models/Macred/TipoFormaPagoAnalisis';
import { MacTiposMoneda } from '@app/_models/Macred/TiposMoneda';
import { MacModeloAnalisis } from '@app/_models/Macred/ModeloAnalisis';
import { MacNivelCapacidadPago } from '@app/_models/Macred/NivelCapacidadPago';
import { MacTipoGenerador } from '@app/_models/Macred/TipoGenerador';
import { MacAnalisisCapacidadPago } from '@app/_models/Macred/AnalisisCapacidadPago';
import { MacTipoIngreso } from '@app/_models/Macred/TipoIngreso';
import { MacIngresosXAnalisis } from '@app/_models/Macred/IngresosXAnalisis';
import { MacExtrasAplicables } from '@app/_models/Macred/ExtrasAplicables';
import { MacMatrizAceptacionIngreso } from '@app/_models/Macred/MatrizAceptacionIngreso';
import { MacTipoDeducciones } from '@app/_models/Macred/TipoDeduccion';
import { MacDeduccionesAnalisis } from '@app/_models/Macred/DeduccionAnalisis';
import { MacTipoPersona } from '@app/_models/Macred/TipoPersona';
import { MacTipoGenero } from '@app/_models/Macred/TipoGenero';
import { MacCondicionLaboral } from '@app/_models/Macred/CondicionLaboral';
import { MacCategoriaCredito } from '@app/_models/Macred/CategoriaCredito';
import { MacTipoAsociado } from '@app/_models/Macred/TipoAsociado';
import { MacTipoHabitacion } from '@app/_models/Macred/TipoHabitacion';
import { MacEstadoCivil } from '@app/_models/Macred/EstadoCivil';
import {  AnalisisHistoricoPD,
          GruposPD,
          IndicadoresPorGrupoPD,
          MacEscenariosRiesgos,
          MacIndicadoresRelevantes,
          MacNivelesXIndicador,
          MacParametrosGenerales,
          MacVariablesCriticas,
          ModelosPD,
          ScoringFlujoCajaLibre,
          TipoActividadEconomica,
          VariablesPD } from '@app/_models/Macred';
import { AccountService } from './account.service';
import { EntidadFinanciera } from '@app/_models/Macred/EntidadFinanciera';
import { Periocidad } from '@app/_models/Macred/Periocidad';
import { TipoLineaCredito } from '@app/_models/Macred/TipoLineaCredito';
import { CategoriaRiesgo } from '@app/_models/Macred/CategoriaRiesgo';
import { TipoObligacion } from '@app/_models/Macred/TipoObligacion';
import { FactoresInferibles } from '@app/_models/Macred/FactoresInferibles';
import { RangoExtra } from '@app/_models/Macred/RangoExtra';
import { PonderacionRiesgo } from '@app/_models/Macred/PonderacionRangos';
import { TipoMoneda } from '@app/_models/Macred/TipoMoneda';
import { MacGrupoModeloCalificacion, MacIndicadorGrupoModeloCalificacion, MacModeloCalificacion } from '@app/_models/Macred/ModeloCalificacion';
import { MacGrupoModeloPD, MacIndicadorGrupoModeloPD, MacModeloPD } from '@app/_models/Macred/ModeloPD';

@Injectable({ providedIn: 'root' })
export class MacredService {

    private _user: User;
    private _module: Module;
    private _business: Compania;
  
    public get userValue(): User { return this._user; }
    public get businessValue(): Compania { return this._business; }
    public get moduleValue(): Module { return this._module; }
  
    private _headers : HttpHeaders;
    public get headersValue(): HttpHeaders { return this._headers; }

  constructor(private http: HttpClient,
              private userService: AccountService) {

    this._user = this.userService.userValue;
    this._business = this.userService.businessValue;
    this._module = this.userService.moduleValue;

    this._headers = this.creaObjetoHttpHeader();
  }

  // **********************************************************************************************
  // 2025 ** ACTS SEGURIDAD ******
  // **********************************************************************************************
  creaObjetoHttpHeader() : HttpHeaders {
    let idUsuario = this.userValue.id.toString();
    let idBusiness = this.businessValue.id.toString();
    let idModule = this.moduleValue.id.toString();
    const httpHeaders = new HttpHeaders({'Content-Type':'application/json', '_idsession':idUsuario,
                                                                            '_business':idBusiness,
                                                                            '_module':idModule});
    return httpHeaders;
  }
  // **********************************************************************************************

  // NIVELES X INDICADORES RELEVANTES
  getNivelesXIndicador(idIndicador: number) {
    return this.http.get<MacNivelesXIndicador[]>(
      `${environment.apiUrl}/macred/getnivelesxindicador?pidCompania=${this.businessValue.id}
                                                        &pidIndicador=${idIndicador}`,
      { headers: this.headersValue }
    );
  }
  postNivelXIndicador(pobj: MacNivelesXIndicador) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postnivelxindicador`, pobj, { headers: this.headersValue }
    );
  }
  putNivelXIndicador(pobj: MacNivelesXIndicador) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/puttnivelxindicador`, pobj, { headers: this.headersValue }
    );
  }
  deleteNivelXIndicador(pidIndicador: number, pidNivel: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deletenivelxindicador?pidCompania=${this.businessValue.id}
                                                          &pidIndicador=${pidIndicador}
                                                          &pidNivel=${pidNivel}`, 
      { headers: this.headersValue }
    );
  }

  // INDICADORES RELEVANTES
  getIndicadoresRelevantes() {
    return this.http.get<MacIndicadoresRelevantes[]>(
      `${environment.apiUrl}/macred/getindicadoresrelevantes?pidCompania=${this.businessValue.id}`,
      { headers: this.headersValue }
    );
  }
  postIndicadorRelevante(pobj: MacIndicadoresRelevantes) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postindicadorrelevante`, pobj,
      { headers: this.headersValue }
    );
  }
  putIndicadorRelevante(pobj: MacIndicadoresRelevantes) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putindicadorrelevante`, pobj,
      { headers: this.headersValue }
    );
  }
  deleteIndicadorRelevante(pIndRelevante: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deleteindicadorRelevante?pidIndRelevante=${pIndRelevante}`,
      { headers: this.headersValue }
    );
  }

  // VARIABES CRITICAS
  getVariablesCriticas() {
    return this.http.get<MacVariablesCriticas[]>(
      `${environment.apiUrl}/macred/getvariablescriticas?pidCompania=${this.businessValue.id}
                                                        &pidModulo=${this.moduleValue.id}`,
      { headers: this.headersValue }
    );
  }
  postVariableCritica(pobj: MacVariablesCriticas) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postvariablecritica`, pobj,
      { headers: this.headersValue }
    );
  }
  putVariableCritica(pobj: MacVariablesCriticas) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putvariablecritica`, pobj,
      { headers: this.headersValue }
    );
  }
  deleteVariableCritica(pid: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deletevariablecritica?pid=${pid}`,
      { headers: this.headersValue }
    );
  }

  // NIVEL DE CAPACIDAD DE PAGO
  getNivelesCapacidadPago(pininactivos: boolean) {
    return this.http.get<MacNivelCapacidadPago[]>(
      `${environment.apiUrl}/macred/getnivelcapacidadpago?idCompania=${this.businessValue.id}&ininactivos=${pininactivos}`,
      { headers: this.headersValue }
    );
  }
  postNiveleCapacidadPago(pobj: MacNivelCapacidadPago) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postnivelcapacidadpago`, pobj,
      { headers: this.headersValue }
    );
  }
  putNiveleCapacidadPago(pobj: MacNivelCapacidadPago) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putnivelcapacidadpago`, pobj,
      { headers: this.headersValue }
    );
  }
  deleteNiveleCapacidadPago(pid: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deletenivelcapacidadpago?pid=${pid}`,
      { headers: this.headersValue } );
  }

  // VARIABLES PD
  deleteVariablePD(pid: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deletevariablepd?pid=${pid}`,
      { headers: this.headersValue } );
  }
  getVariablesPD() {
    return this.http.get<VariablesPD[]>(
      `${environment.apiUrl}/macred/getvariablespd?idCompania=${this.businessValue.id}`,
      { headers: this.headersValue } );
  }
  getVariablesActivasPD() {
    return this.http.get<VariablesPD[]>(
      `${environment.apiUrl}/macred/getvariablesactivaspd?idCompania=${this.businessValue.id}`,
      { headers: this.headersValue } );
  }
  postVariablePD(inVariablePD: VariablesPD) {
    return this.http.post<ResponseMessage>( 
      `${environment.apiUrl}/macred/postvariablepd`, inVariablePD,
      { headers: this.headersValue } );
  }
  putVariablePD(pobj: VariablesPD) {
    return this.http.put<ResponseMessage>( `${environment.apiUrl}/macred/putvariablepd`, pobj, 
      { headers: this.headersValue } );
  }

  // INDICADORES GRUPOS MODELOS PD
  getIndicadoresGrupoModPD(pidGrupo : number) {
    return this.http.get<MacIndicadorGrupoModeloPD[]>(
      `${environment.apiUrl}/macred/getindicadoresgrupomodpd?pidGrupo=${ pidGrupo }
        &pidBusiness=${ this.businessValue.id }
        &pidModule=${ this.moduleValue.id }`, { headers: this.headersValue } );
  }
  postIndicadoresGrupoModPD(pobj: MacIndicadorGrupoModeloPD) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postindicadorgrupomodpd`, pobj, { headers: this.headersValue });
  }
  putIndicadoresGrupoModPD(pobj: MacIndicadorGrupoModeloPD) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putindicadorgrupomodpd`, pobj, { headers: this.headersValue });
  }
  deleteIndicadoresGrupoModPD(pid: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deleteindicadorgrupomodpd?pid=${pid}`,
      { headers: this.headersValue });
  }

  // GRUPOS MODELOS CALIFICACION
  getGruposModelosPD(pidModelo : number) {
    return this.http.get<MacGrupoModeloPD[]>(
      `${environment.apiUrl}/macred/getgruposmodpd?pidModelo=${ pidModelo }
                                                  &pidBusiness=${ this.businessValue.id }
                                                  &pidModule=${ this.moduleValue.id }`, { headers: this.headersValue } );
  }
  postGrupoModeloPD(pobj: MacGrupoModeloPD) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postgrupomodpd`, pobj, { headers: this.headersValue });
  }
  putGrupoModeloPD(pobj: MacGrupoModeloPD) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putgrupomodpd`, pobj, { headers: this.headersValue });
  }
  deleteGrupoModeloPD(pid: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deletegrupomodpd?pid=${pid}`,
      { headers: this.headersValue });
  }

  // MODELOS CALIFICACION
  getModeloPD(pid : number) {
    return this.http.get<MacModeloPD>(
      `${environment.apiUrl}/macred/getmodelopd?pid=${pid}`,
      { headers: this.headersValue } );
  }
  getModelosPD() {
    return this.http.get<MacModeloPD[]>(
      `${environment.apiUrl}/macred/getmodelospd?pidBusiness=${this.businessValue.id}
                                                &pidModule=${this.moduleValue.id}`,
      { headers: this.headersValue } );
  }
  postModeloPD(pobj: MacModeloPD) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postmodelopd`, pobj, { headers: this.headersValue });
  }
  putModeloPD(pobj: MacModeloPD) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putmodelopd`, pobj, { headers: this.headersValue });
  }
  deleteModeloPD(pid: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deletemodelopd?pid=${pid}`,
      { headers: this.headersValue });
  }

  // INDICADORES GRUPOS MODELOS CALIFICACION
  getIndicadoresGrupoModCalif(pidGrupo : number) {
    return this.http.get<MacIndicadorGrupoModeloCalificacion[]>(
      `${environment.apiUrl}/macred/getindicadoresgrupomodcalif?pidGrupo=${ pidGrupo }
        &pidBusiness=${ this.businessValue.id }
        &pidModule=${ this.moduleValue.id }`, { headers: this.headersValue } );
  }
  postIndicadoresGrupoModCalif(pobj: MacIndicadorGrupoModeloCalificacion) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postindicadorgrupomodcalif`, pobj, { headers: this.headersValue });
  }
  putIndicadoresGrupoModCalif(pobj: MacIndicadorGrupoModeloCalificacion) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putindicadorgrupomodcalif`, pobj, { headers: this.headersValue });
  }
  deleteIndicadoresGrupoModCalif(pid: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deleteindicadorgrupomodcalif?pid=${pid}`,
      { headers: this.headersValue });
  }

  // GRUPOS MODELOS CALIFICACION
  getGruposModelosCalificacion(pidModelo : number) {
    return this.http.get<MacGrupoModeloCalificacion[]>(
      `${environment.apiUrl}/macred/getgruposmodcalificacion?pidModelo=${ pidModelo }
        &pidBusiness=${ this.businessValue.id }
        &pidModule=${ this.moduleValue.id }`, { headers: this.headersValue } );
  }
  postGrupoModeloCalificacion(pobj: MacGrupoModeloCalificacion) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postgrupomodcalificacion`, pobj, { headers: this.headersValue });
  }
  putGrupoModeloCalificacion(pobj: MacGrupoModeloCalificacion) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putgrupomodcalificacion`, pobj, { headers: this.headersValue });
  }
  deleteGrupoModeloCalificacion(pid: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deletegrupomodcalificacion?pid=${pid}`,
      { headers: this.headersValue });
  }

  // MODELOS CALIFICACION
  getModeloCalificacion(pid : number) {
    return this.http.get<MacModeloCalificacion>(
      `${environment.apiUrl}/macred/getmodelocalificacion?pid=${pid}`,
      { headers: this.headersValue } );
  }
  getModelosCalificacion() {
    return this.http.get<MacModeloCalificacion[]>(
      `${environment.apiUrl}/macred/getmodeloscalificacion?pidBusiness=${this.businessValue.id}
                                                          &pidModule=${this.moduleValue.id}`,
      { headers: this.headersValue } );
  }
  getModelosCalificacionActivos() {
    return this.http.get<MacModeloCalificacion[]>(
      `${environment.apiUrl}/macred/getmodeloscalificacionactivos?pidBusiness=${this.businessValue.id}
                                                                  &pidModule=${this.moduleValue.id}`,
      { headers: this.headersValue } );
  }
  postModeloCalificacion(pobj: MacModeloCalificacion) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postmodelocalificacion`, pobj, { headers: this.headersValue });
  }
  putModeloCalificacion(pobj: MacModeloCalificacion) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putmodelocalificacion`, pobj, { headers: this.headersValue });
  }
  deleteModeloCalificacion(pid: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deletemodelocalificacion?pid=${pid}`,
      { headers: this.headersValue });
  }

  // ENTIDADES FINANCIERAS
  GET_ENTIDAD_FINANCIERA() {
    return this.http.get<EntidadFinanciera[]>(
      `${environment.apiUrl}/macred/getentidadfinanciera?pidBusiness=${this.businessValue.id}
                                                        &pidModule=${this.moduleValue.id}`,
      { headers: this.headersValue } );
  }
  POST_ENTIDAD_FINANCIERA(pobj: EntidadFinanciera) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postentidadfinanciera`, pobj, { headers: this.headersValue });
  }
  PUT_ENTIDAD_FINANCIERA(pobj: EntidadFinanciera) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putentidadfinanciera`, pobj, { headers: this.headersValue });
  }
  DELETE_ENTIDAD_FINANCIERA(pobj: EntidadFinanciera) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deleteentidadfinanciera?pid=${pobj.id}
                                                            &pidBusiness=${pobj.idCompania}
                                                            &pidModule=${pobj.idModulo}`, 
      { headers: this.headersValue });
  }
  // PERIOCIDADES
  GET_PERIOCIDAD() {
    return this.http.get<Periocidad[]>(
      `${environment.apiUrl}/macred/getperiocidad?pidBusiness=${this.businessValue.id}
                                                  &pidModule=${this.moduleValue.id}`,
      { headers: this.headersValue } );
  }
  POST_PERIOCIDAD(pobj: Periocidad) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postperiocidad`, pobj, { headers: this.headersValue });
  }
  PUT_PERIOCIDAD(pobj: Periocidad) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putperiocidad`, pobj, { headers: this.headersValue });
  }
  DELETE_PERIOCIDAD(pobj: Periocidad) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deleteperiocidad?pid=${pobj.id}
                                                    &pidBusiness=${pobj.idCompania}
                                                    &pidModule=${pobj.idModulo}`, 
      { headers: this.headersValue });
  }
  // TIPOS LÍNEAS DE CRÉDITO
  GET_TIPOS_CREDITO() {
    return this.http.get<TipoLineaCredito[]>(
      `${environment.apiUrl}/macred/gettipolineacredito?pidBusiness=${this.businessValue.id}
                                                        &pidModule=${this.moduleValue.id}`,
      { headers: this.headersValue } );
  }
  POST_TIPOS_CREDITO(pobj: TipoLineaCredito) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/posttipolineacredito`, pobj, { headers: this.headersValue });
  }
  PUT_TIPOS_CREDITO(pobj: TipoLineaCredito) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/puttipolineacredito`, pobj, { headers: this.headersValue });
  }
  DELETE_TIPOS_CREDITO(pobj: TipoLineaCredito) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deletetipolineacredito?pid=${pobj.id}
                                                          &pidBusiness=${pobj.idCompania}
                                                          &pidModule=${pobj.idModulo}`, 
      { headers: this.headersValue });
  }
  // CATEGORÍAS RIESGO
  GET_CATEGORIA_RIESGO() {
    return this.http.get<CategoriaRiesgo[]>(
      `${environment.apiUrl}/macred/getcategoriariesgo?pidBusiness=${this.businessValue.id}
                                                      &pidModule=${this.moduleValue.id}`,
      { headers: this.headersValue } );
  }
  POST_CATEGORIA_RIESGO(pobj: CategoriaRiesgo) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postcategoriariesgo`, pobj, { headers: this.headersValue });
  }
  PUT_CATEGORIA_RIESGO(pobj: CategoriaRiesgo) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putcategoriariesgo`, pobj, { headers: this.headersValue });
  }
  DELETE_CATEGORIA_RIESGO(pobj: CategoriaRiesgo) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deletecategoriariesgo?pid=${pobj.id}
                                                          &pidBusiness=${pobj.idCompania}
                                                          &pidModule=${pobj.idModulo}`, 
      { headers: this.headersValue });
  }

  // TIPOS DEDUCCIONES
  GET_TIPO_DEDUCCION() {
    return this.http.get<TipoObligacion[]>(
      `${environment.apiUrl}/macred/gettipodeduccion?pidBusiness=${this.businessValue.id}
                                                    &pidModule=${this.moduleValue.id}`,
      { headers: this.headersValue } );
  }
  POST_TIPO_DEDUCCION(pobj: TipoObligacion) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/posttipodeduccion`, pobj, { headers: this.headersValue });
  }
  PUT_TIPO_DEDUCCION(pobj: TipoObligacion) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/puttipodeduccion`, pobj, { headers: this.headersValue });
  }
  DELETE_TIPO_DEDUCCION(pobj: TipoObligacion) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deletetipodeduccion?pid=${pobj.id}
                                                        &pidBusiness=${pobj.idCompania}
                                                        &pidModule=${pobj.idModulo}`, 
      { headers: this.headersValue });
  }

  // FACTORES INFERIBLES
  GET_FACTORES_INFERIBLES() {
    return this.http.get<FactoresInferibles[]>(
      `${environment.apiUrl}/macred/getfactorinferible?pidBusiness=${this.businessValue.id}
                                                      &pidModule=${this.moduleValue.id}`,
      { headers: this.headersValue } );
  }
  POST_FACTORES_INFERIBLES(pobj: FactoresInferibles) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postfactorinferible`, pobj, { headers: this.headersValue });
  }
  PUT_FACTORES_INFERIBLES(pobj: FactoresInferibles) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putfactorinferible`, pobj, { headers: this.headersValue });
  }
  DELETE_FACTORES_INFERIBLES(pobj: FactoresInferibles) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deletefactorinferible?pid=${pobj.id}
                                                          &pidBusiness=${pobj.idCompania}
                                                          &pidModule=${pobj.idModulo}`, 
      { headers: this.headersValue });
  }

  // RANGOS EXTRAS
  GET_RANGOS_EXTRAS() {
    return this.http.get<RangoExtra[]>(
      `${environment.apiUrl}/macred/getrangoextra?pidBusiness=${this.businessValue.id}
                                                  &pidModule=${this.moduleValue.id}`,
      { headers: this.headersValue } );
  }
  POST_RANGOS_EXTRAS(pobj: RangoExtra) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postrangoextra`, pobj, { headers: this.headersValue });
  }
  PUT_RANGOS_EXTRAS(pobj: RangoExtra) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putrangoextra`, pobj, { headers: this.headersValue });
  }
  DELETE_RANGOS_EXTRAS(pobj: RangoExtra) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deleterangoextra?pid=${pobj.id}
                                                    &pidBusiness=${pobj.idCompania}
                                                    &pidModule=${pobj.idModulo}`, 
      { headers: this.headersValue });
  }

  // PONDERACION RIESGO
  GET_PONDERACION_RIESGO() {
    return this.http.get<PonderacionRiesgo[]>(
      `${environment.apiUrl}/macred/getponderacionriesgo?pidBusiness=${this.businessValue.id}
                                                        &pidModule=${this.moduleValue.id}`,
      { headers: this.headersValue } );
  }
  POST_PONDERACION_RIESGO(pobj: PonderacionRiesgo) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postponderacionriesgo`, pobj, { headers: this.headersValue });
  }
  PUT_PONDERACION_RIESGO(pobj: PonderacionRiesgo) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putponderacionriesgo`, pobj, { headers: this.headersValue });
  }
  DELETE_PONDERACION_RIESGO(pobj: PonderacionRiesgo) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deleteponderacionriesgo?pid=${pobj.id}
                                                            &pidBusiness=${pobj.idCompania}
                                                            &pidModule=${pobj.idModulo}`, 
      { headers: this.headersValue });
  }

  // TIPO MONEDA
  GET_TIPO_MONEDA() {
    return this.http.get<TipoMoneda[]>(
      `${environment.apiUrl}/macred/gettipomoneda?pidBusiness=${this.businessValue.id}
                                                  &pidModule=${this.moduleValue.id}`,
      { headers: this.headersValue } );
  }
  POST_TIPO_MONEDA(pobj: TipoMoneda) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/posttipomoneda`, pobj, { headers: this.headersValue });
  }
  PUT_TIPO_MONEDA(pobj: TipoMoneda) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/puttipomoneda`, pobj, { headers: this.headersValue });
  }
  DELETE_TIPO_MONEDA(pobj: TipoMoneda) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deletetipomoneda?pid=${pobj.id}
                                                    &pidBusiness=${pobj.idCompania}
                                                    &pidModule=${pobj.idModulo}`, 
      { headers: this.headersValue });
  }



  getPersonasIdentificacion(pidentificacion: string) {
    return this.http.get<MacPersona[]>(
      `${environment.apiUrl}/macred/getpersonasidentificacion?pidentificacion=${pidentificacion}
                                                              &pidBusiness=${this.businessValue.id}`, 
      { headers: this.headersValue }
    );
  }
  getPersonasNombre(pnombre: string) {
    return this.http.get<MacPersona[]>(
      `${environment.apiUrl}/macred/getpersonasnombre?pnombre=${pnombre}
                                                      &pidBusiness=${this.businessValue.id}`, 
      { headers: this.headersValue }
    );
  }
  getPersonasApellido(papellido: string) {
    return this.http.get<MacPersona[]>(
      `${environment.apiUrl}/macred/getpersonasapellido?papellido=${papellido}
                                                        &pidBusiness=${this.businessValue.id}`, 
      { headers: this.headersValue }
    );
  }
  getPersonaMacred(identificacionPersona: string, idCompania: number) {
    return this.http.get<MacPersona>(
      `${environment.apiUrl}/macred/getpersonaidentificacion?identificacionPersona=${identificacionPersona}
                                                            &idCompania=${idCompania}`, 
      { headers: this.headersValue }
    );
  }
  getPersonasCompania(idCompania: number) {
    return this.http.get<MacPersona[]>(
      `${environment.apiUrl}/macred/getpersonascompania?idCompania=${idCompania}`, 
      { headers: this.headersValue }
    );
  }
  postPersona(persona: MacPersona) {
    return this.http.post<MacPersona>(
      `${environment.apiUrl}/macred/createpersona`, persona, { headers: this.headersValue }
    );
  }
  putPersona(persona: MacPersona) {
    return this.http.put<MacPersona>(
      `${environment.apiUrl}/macred/updatepersona`, persona, { headers: this.headersValue }
    );
  }
  deletePersona(idPersona: number) {
    return this.http.delete<MacPersona>(
      `${environment.apiUrl}/macred/deletepersona?idPersona=${idPersona}`, 
      { headers: this.headersValue }
    );
  }

  // act 2025 - malekuti
  getInfoCreditoPersona(pidPersona: number) {
    return this.http.get<MacInformacionCreditoPersona[]>(
      `${environment.apiUrl}/macred/getinfocreditopersona?pidpersona=${pidPersona}`, 
      { headers: this.headersValue }
    );
  }
  postInfoCreditoPersona(pobj: MacInformacionCreditoPersona) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postinfocreditopersona`, pobj, { headers: this.headersValue }
    );
  }
  putInfoCreditoPersona(pobj: MacInformacionCreditoPersona) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putinfocreditopersona`, pobj, { headers: this.headersValue }
    );
  }
  deleteInfoCreditoPersona(pid: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deleteinfocreditopersona?pid=${pid}`, { headers: this.headersValue }
    );
  }
  //




  getEstadosCiviles() {
    return this.http.get<MacEstadoCivil[]>(
      `${environment.apiUrl}/macred/getestadosciviles?pidCompania=${this.businessValue.id}`,
      { headers: this.headersValue }
    );
  }
  postEstadoCivil(estadoCivil: MacEstadoCivil) {
    return this.http.post<MacEstadoCivil>(
      `${environment.apiUrl}/macred/createestadocivil`,
      estadoCivil
    );
  }
  putEstadoCivil(estadoCivil: MacEstadoCivil) {
    return this.http.put<MacEstadoCivil>(
      `${environment.apiUrl}/macred/updateestadocivil`,
      estadoCivil
    );
  }
  deleteEstadoCivil(idEstadoCivil: number) {
    return this.http.delete<MacEstadoCivil>(
      `${environment.apiUrl}/macred/deleteestadocivil?idEstadoCivil=${idEstadoCivil}`
    );
  }
  getTiposPersonasCompania(idCompania: number) {
    return this.http.get<MacTipoPersona[]>(
      `${environment.apiUrl}/macred/gettipospersonascompania?idCompania=${idCompania}`
    );
  }
  postTipoPersona(tipoPersona: MacTipoPersona) {
    return this.http.post<MacTipoPersona>(
      `${environment.apiUrl}/macred/createtipopersona`,
      tipoPersona
    );
  }
  putTipoPersona(tipoPersona: MacTipoPersona) {
    return this.http.put<MacTipoPersona>(
      `${environment.apiUrl}/macred/updatetipopersona`,
      tipoPersona
    );
  }
  deleteTipoPesona(idTipoPersona: number) {
    return this.http.delete<MacTipoPersona>(
      `${environment.apiUrl}/macred/deletetipopersona?idTipoPersona=${idTipoPersona}`
    );
  }
  getTiposGenerosCompania(idCompania: number) {
    return this.http.get<MacTipoGenero[]>(
      `${environment.apiUrl}/macred/gettiposgeneroscompania?idCompania=${idCompania}`
    );
  }
  postTipoGenero(tipoGenero: MacTipoGenero) {
    return this.http.post<MacTipoGenero>(
      `${environment.apiUrl}/macred/createtipogenero`,
      tipoGenero
    );
  }
  putTipoGenero(tipoGenero: MacTipoGenero) {
    return this.http.put<MacTipoGenero>(
      `${environment.apiUrl}/macred/updatetipogenero`,
      tipoGenero
    );
  }
  deleteTipoGenero(idTipoGenero: number) {
    return this.http.delete<MacTipoGenero>(
      `${environment.apiUrl}/macred/deletetipogenero?idTipoGenero=${idTipoGenero}`
    );
  }
  getCondicionesLaboralesCompania(idCompania: number) {
    return this.http.get<MacCondicionLaboral[]>(
      `${environment.apiUrl}/macred/getcondicioneslaboralescompania?idCompania=${idCompania}`
    );
  }
  postCondicionLaboral(condicionLaboral: MacCondicionLaboral) {
    return this.http.post<MacCondicionLaboral>(
      `${environment.apiUrl}/macred/createcondicionlaboral`,
      condicionLaboral
    );
  }
  putCondicionLaboral(condicionLaboral: MacCondicionLaboral) {
    return this.http.put<MacCondicionLaboral>(
      `${environment.apiUrl}/macred/updatecondicionlaboral`,
      condicionLaboral
    );
  }
  deleteCondicionLaboral(idCondicionLaboral: number) {
    return this.http.delete<MacCondicionLaboral>(
      `${environment.apiUrl}/macred/deletecondicionlaboral?idCondicionLaboral=${idCondicionLaboral}`
    );
  }
  getCategoriasCreditosCompania(idCompania: number) {
    return this.http.get<MacCategoriaCredito[]>(
      `${environment.apiUrl}/macred/getcategoriascreditoscompania?idCompania=${idCompania}`
    );
  }
  getTiposAsociadosCompania(idCompania: number) {
    return this.http.get<MacTipoAsociado[]>(
      `${environment.apiUrl}/macred/gettiposasociadoscompania?idCompania=${idCompania}`
    );
  }
  postTipoAsociado(tipoAsociado: MacTipoAsociado) {
    return this.http.post<MacTipoAsociado>(
      `${environment.apiUrl}/macred/createtipoasociado`,
      tipoAsociado
    );
  }
  putTipoAsociado(tipoAsociado: MacTipoAsociado) {
    return this.http.put<MacTipoAsociado>(
      `${environment.apiUrl}/macred/updatetipoasociado`,
      tipoAsociado
    );
  }
  deleteTipoAsociado(idTipoAsociado: number) {
    return this.http.delete<MacTipoAsociado>(
      `${environment.apiUrl}/macred/deletetipoasociado?idTipoAsociado=${idTipoAsociado}`
    );
  }
  getTiposHabitacionesCompania(idCompania: number) {
    return this.http.get<MacTipoHabitacion[]>(
      `${environment.apiUrl}/macred/gettiposhabitacionescompania?idCompania=${idCompania}`
    );
  }
  getTiposIngresoAnalisis(idCompania: number) {
    return this.http.get<MacTipoIngresoAnalisis[]>(
      `${environment.apiUrl}/macred/gettipoingresoanalisis?idCompania=${idCompania}`
    );
  }
  postTipoIngresoAnalisis(TipoIngresoAnalisis: MacTipoIngresoAnalisis) {
    return this.http.post<MacTipoIngresoAnalisis>(
      `${environment.apiUrl}/macred/createtipoingresoanalisis`,
      TipoIngresoAnalisis
    );
  }
  putTipoIngresoAnalisis(TipoIngresoAnalisis: MacTipoIngresoAnalisis) {
    return this.http.put<MacTipoIngresoAnalisis>(
      `${environment.apiUrl}/macred/updatetipoingresoanalisis`,
      TipoIngresoAnalisis
    );
  }
  deleteTipoIngresoAnalisis(idTipoIngresoAnalisis: number) {
    return this.http.delete<MacTipoIngresoAnalisis>(
      `${environment.apiUrl}/macred/deletetipoingresoanalisis?idTipoIngresoAnalisis=${idTipoIngresoAnalisis}`
    );
  }

  getTiposFormaPagoAnalisis(idCompania: number) {
    return this.http.get<MacTipoFormaPagoAnalisis[]>(
      `${environment.apiUrl}/macred/gettipoformapagoanalisis?idCompania=${idCompania}`
    );
  }
  postTipoFormaPagoAnalisis(TipoFormaPagoAnalisis: MacTipoFormaPagoAnalisis) {
    return this.http.post<MacTipoFormaPagoAnalisis>(
      `${environment.apiUrl}/macred/createtipoformapagoanalisis`,
      TipoFormaPagoAnalisis
    );
  }
  putTipoFormaPagoAnalisis(TipoFormaPagoAnalisis: MacTipoFormaPagoAnalisis) {
    return this.http.put<MacTipoFormaPagoAnalisis>(
      `${environment.apiUrl}/macred/updatetipoformapagoanalisis`,
      TipoFormaPagoAnalisis
    );
  }
  deleteTipoFormaPagoAnalisis(idTipoFormaPagoAnalisis: number) {
    return this.http.delete<MacTipoFormaPagoAnalisis>(
      `${environment.apiUrl}/macred/deletetipoformapagoanalisis?idTipoFormaPagoAnalisis=${idTipoFormaPagoAnalisis}`
    );
  }
  GetParametroGeneralVal1(
    idCompania: number,
    codParametro: string,
    esNumerico: boolean
  ) {
    return this.http.get<string>(
      `${environment.apiUrl}/macred/getparametrogeneralval1?idCompania=${idCompania}&codParametro=${codParametro}&esNumerico=${esNumerico}`
    );
  }
  getParametrosGeneralesCompania(idCompania: number) {
    return this.http.get<MacParametrosGenerales[]>(
      `${environment.apiUrl}/macred/getparametrosgeneralescompania?idCompania=${idCompania}`
    );
  }
  postParametroGeneral(parametroGeneral: MacParametrosGenerales) {
    return this.http.post<MacParametrosGenerales>(
      `${environment.apiUrl}/macred/createparametrogeneral`,
      parametroGeneral
    );
  }
  putParametroGeneral(parametroGeneral: MacParametrosGenerales) {
    return this.http.put<MacParametrosGenerales>(
      `${environment.apiUrl}/macred/updateparametrogeneral`,
      parametroGeneral
    );
  }
  deleteParametroGeneral(idParametroGeneral: number) {
    return this.http.delete<MacParametrosGenerales>(
      `${environment.apiUrl}/macred/deleteparametrogeneral?idParametroGeneral=${idParametroGeneral}`
    );
  }

  getCodigoCategoriaCreditoPersona(idCompania: number, idPersona: number) {
    return this.http.get<string>(
      `${environment.apiUrl}/macred/getcodcategoriacredito?idCompania=${idCompania}&idPersona=${idPersona}`
    );
  }
  getTiposMonedas(idCompania: number) {
    return this.http.get<MacTiposMoneda[]>(
      `${environment.apiUrl}/macred/gettiposmonedas?idCompania=${idCompania}`
    );
  }
  getModelosAnalisis(idCompania: number, incluyeInactivos: boolean) {
    return this.http.get<MacModeloAnalisis[]>(
      `${environment.apiUrl}/macred/getmodelosanalisis?idCompania=${idCompania}&incluyeInactivos=${incluyeInactivos}`
    );
  }
  getTiposGenerador(idCompania: number, incluyeInactivos: boolean) {
    return this.http.get<MacTipoGenerador[]>(
      `${environment.apiUrl}/macred/gettiposgeneradores?idCompania=${idCompania}&incluyeInactivos=${incluyeInactivos}`
    );
  }
  postAnalisisCapPago(analisis: MacAnalisisCapacidadPago) {
    return this.http.post<MacAnalisisCapacidadPago>(
      `${environment.apiUrl}/macred/createanalisiscapacidadpago`,
      analisis
    );
  }
  putAnalisisCapPago(analisis: MacAnalisisCapacidadPago) {
    return this.http.put<MacAnalisisCapacidadPago>(
      `${environment.apiUrl}/macred/updateanalisiscapacidadpago`,
      analisis
    );
  }

  getTiposIngresos(idCompania: number, incluyeInactivos: boolean) {
    return this.http.get<MacTipoIngreso[]>(
      `${environment.apiUrl}/macred/gettiposingresos?idCompania=${idCompania}&incluyeInactivos=${incluyeInactivos}`
    );
  }
  postTipoIngreso(TipoIngreso: MacTipoIngreso) {
    return this.http.post<MacTipoIngreso>(
      `${environment.apiUrl}/macred/createtipoingreso`,
      TipoIngreso
    );
  }
  putTipoIngreso(TipoIngreso: MacTipoIngreso) {
    return this.http.put<MacTipoIngreso>(
      `${environment.apiUrl}/macred/updatetipoingreso`,
      TipoIngreso
    );
  }
  deleteTipoIngreso(idTipoIngreso: number) {
    return this.http.delete<MacTipoIngreso>(
      `${environment.apiUrl}/macred/deletetipoingreso?idTipoIngreso=${idTipoIngreso}`
    );
  }

  getIngresosAnalisis(idCompania: number, codigoAnalisis: number) {
    return this.http.get<MacIngresosXAnalisis[]>(
      `${environment.apiUrl}/macred/getingresosanalisis?idCompania=${idCompania}&codigoAnalisis=${codigoAnalisis}`
    );
  }
  getExtrasAplicables(idCompania: number, codigoAnalisis: number) {
    return this.http.get<MacExtrasAplicables[]>(
      `${environment.apiUrl}/macred/getextrasaplicanles?idCompania=${idCompania}&codigoAnalisis=${codigoAnalisis}`
    );
  }
  postExtrasAplicables(extras: MacExtrasAplicables) {
    return this.http.post<MacExtrasAplicables>(
      `${environment.apiUrl}/macred/createextrasaplicables`,
      extras
    );
  }
  getHistorialAnlisis(idCompania: number) {
    return this.http.get<MacAnalisisCapacidadPago[]>(
      `${environment.apiUrl}/macred/gethistorialcapacidadpago?idCompania=${idCompania}`
    );
  }
  getMatrizAceptacionIngreso(idCompania: number, incluyeInactivos: boolean) {
    return this.http.get<MacMatrizAceptacionIngreso[]>(
      `${environment.apiUrl}/macred/getmatrizaceptacioningreso?idCompania=${idCompania}&incluyeInactivos=${incluyeInactivos}`
    );
  }
  getExtrasAnalisisIngreso(
    idCompania: number,
    codigoAnalisis: number,
    idIngreso: number
  ) {
    return this.http.get<MacExtrasAplicables>(
      `${environment.apiUrl}/macred/getextrasanalisisingreso?idCompania=${idCompania}&codigoAnalisis=${codigoAnalisis}&idIngreso=${idIngreso}`
    );
  }

  getTiposDeducciones(idCompania: number, incluyeInactivos: boolean) {
    return this.http.get<MacTipoDeducciones[]>(
      `${environment.apiUrl}/macred/gettiposdeducciones?idCompania=${idCompania}&incluyeInactivos=${incluyeInactivos}`
    );
  }
  postDeduccionesAnalisis(deduccion: MacDeduccionesAnalisis) {
    return this.http.post<MacDeduccionesAnalisis>(
      `${environment.apiUrl}/macred/creatededuccionesanalisis`,
      deduccion
    );
  }
  getDeduccionesAnalisisPorIngreso(
    idCompania: number,
    codigoAnalisis: number,
    idIngreso: number
  ) {
    return this.http.get<MacDeduccionesAnalisis[]>(
      `${environment.apiUrl}/macred/getdeduccionesanalisisingreso?idCompania=${idCompania}&codigoAnalisis=${codigoAnalisis}&idIngreso=${idIngreso}`
    );
  }
  getDeduccionesAnalisis(idCompania: number, codigoAnalisis: number) {
    return this.http.get<MacDeduccionesAnalisis[]>(
      `${environment.apiUrl}/macred/getdeduccionesanalisis?idCompania=${idCompania}&codigoAnalisis=${codigoAnalisis}`
    );
  }
  postIngresosAnalisis(ingresoAnalisis: MacIngresosXAnalisis) {
    return this.http.post<MacIngresosXAnalisis>(
      `${environment.apiUrl}/macred/createingresosanalisis`,
      ingresoAnalisis
    );
  }
  putIngresosAnalisis(ingresoAnalisis: MacIngresosXAnalisis) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/updateingresosanalisis`,
      ingresoAnalisis
    );
  }
  putDeduccionAnalisis(deduccionAnalisis: MacDeduccionesAnalisis) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/updatededuccionanalisis`,
      deduccionAnalisis
    );
  }
  deleteExtra(idExtras: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/eliminarextrasaplicables?idExtras=${idExtras}`
    );
  }
  deleteDeduccion(idDeduccion: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/eliminardeduccioningreso?idDeduccion=${idDeduccion}`
    );
  }
  deleteIngreso(idIngreso: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/eliminaringresoanalisis?idIngreso=${idIngreso}`
    );
  }

  //#region Parametos PD Modelos

  calculoAnalisisPD(inAnalisisPD: AnalisisHistoricoPD) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/calculoAnalisisPD`,
      inAnalisisPD
    );
  }

  getAnalisisPD(idAnalisisCapacidadPago: number) {
    return this.http.get<AnalisisHistoricoPD>(
      `${environment.apiUrl}/macred/getAnalisisPD/${idAnalisisCapacidadPago}`
    );
  }

  postAnalisisPD(inAnalisisPD: AnalisisHistoricoPD) {
    return this.http.post<AnalisisHistoricoPD>(
      `${environment.apiUrl}/macred/postAnalisisPD`,
      inAnalisisPD
    );
  }

  //#region MODELOS

  getPDModelos(idCompania: number) {
    return this.http.get<ModelosPD[]>(
      `${environment.apiUrl}/macred/getPDModelos?idCompania=${idCompania}`
    );
  }

  createUpdatePDModelo(inModeloPD: ModelosPD) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/createUpdatePDModelo`,
      inModeloPD
    );
  }

  deletePDModelo(idModeloPd: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deletePDModelo?idModeloPD=${idModeloPd}`
    );
  }

  //#endregion

  //#region GRUPOS PD

  getGruposPDVariable(idModelo: number) {
    return this.http.get<GruposPD[]>(
      `${environment.apiUrl}/macred/getGruposPDVariable?idModelo=${idModelo}`
    );
  }

  getGrupoPDVariable(idGrupo: number) {
    return this.http.get<GruposPD>(
      `${environment.apiUrl}/macred/getGrupoPDVariable?id=${idGrupo}`
    );
  }

  postGrupoPDVariable(inGrupoPD: GruposPD) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postGrupoPDVariable`,
      inGrupoPD
    );
  }

  putGrupoPDVariable(idGrupo: number, inGrupoPD: GruposPD) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putGrupoPDVariable/${idGrupo}`,
      inGrupoPD
    );
  }

  deleteGrupoPDVariable(idGrupo: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deleteGrupoPDVariable/${idGrupo}`
    );
  }

  //#endregion

  //#region INDICADORES POR GRUPO

  getIndicadoresGrupoPD(idGrupo: number) {
    return this.http.get<IndicadoresPorGrupoPD[]>(
      `${environment.apiUrl}/macred/getIndicadoresGrupoPD/${idGrupo}`
    );
  }

  getIndicadorGrupoPD(idIndicador: number, idGrupo: number) {
    return this.http.get<IndicadoresPorGrupoPD>(
      `${environment.apiUrl}/macred/getIndicadoresGrupoPD/${idIndicador}/${idGrupo}`
    );
  }

  postIndicadorGrupoPD(inIndicadorGrupoPD: IndicadoresPorGrupoPD) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postIndicadorGrupoPD`,
      inIndicadorGrupoPD
    );
  }

  deleteIndicadorGrupoPD(idIndicador: number, idGrupo: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deleteIndicadorGrupoPD/${idIndicador}/${idGrupo}`
    );
  }

  //#endregion

  //#endregion

  //#region MODELO FCL

  //#region FCL_SCORING

  getFlujoCajaLibre(idFlujoCapacidadPago: number) {
    return this.http.get<ScoringFlujoCajaLibre>(
      `${environment.apiUrl}/macred/getFlujoCajaLibre/${idFlujoCapacidadPago}`
    );
  }

  postFlujoCajaLibre(inScoringFlujoCaja: ScoringFlujoCajaLibre) {
    return this.http.post<ScoringFlujoCajaLibre>(
      `${environment.apiUrl}/macred/postFlujoCajaLibre`,
      inScoringFlujoCaja
    );
  }

  putFlujoCajaLibre(inScoringFlujoCaja: ScoringFlujoCajaLibre) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putFlujoCajaLibre/${inScoringFlujoCaja.codScoringFlujoCaja}`,
      inScoringFlujoCaja
    );
  }

  //#endregion

  //#region  TIPO ACTIVIDADES ECONOMICAS

  getTiposActividadesEconomicas(idCompania: number) {
    return this.http.get<TipoActividadEconomica[]>(
      `${environment.apiUrl}/macred/getTiposActividadesEconomicas?idCompania=${idCompania}`
    );
  }

  getTipoActividadEconomico(
    idTipoActividadEconomica: number,
    idCompania: number
  ) {
    return this.http.get<TipoActividadEconomica>(
      `${environment.apiUrl}/macred/getTipoActividadEconomico/${idTipoActividadEconomica}/${idCompania}`
    );
  }

  postTipoActividadEconomico(inTipoActividadEconomica: TipoActividadEconomica) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postTipoActividadEconomico`,
      inTipoActividadEconomica
    );
  }

  putTipoActividadEconomico(objeto: TipoActividadEconomica ) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putTipoActividadEconomica`, objeto
    );
  }

  deleteTipoActividadEconomico(
    idTipoActividadEconomica: number,
    idCompania: number
  ) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deleteTipoActividadEconomico/${idTipoActividadEconomica}/${idCompania}`
    );
  }

  //#endregion

  //#endregion

  //#region ESCENARIOS DE RIESGOS

  getEscenariosRiesgos() {
    return this.http.get<MacEscenariosRiesgos[]>(
      `${environment.apiUrl}/macred/getescenariosriesgo?pidCompania=${this.businessValue.id}`
    );
  }
  postEscenariosRiesgo(pobj: MacEscenariosRiesgos) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postescenarioriesgo`, pobj
    );
  }

  putEscenariosRiesgos(
    idCodVariable: number,
    inVariableCritica: MacEscenariosRiesgos
  ) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putEscenariosRiesgo/${idCodVariable}`,
      inVariableCritica
    );
  }

  deleteEscenariosRiesgos(idCodVariable: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deleteEscenariosRiesgo/${idCodVariable}`
    );
  }

  //#endregion
}
