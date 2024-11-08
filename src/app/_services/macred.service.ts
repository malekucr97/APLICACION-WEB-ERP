import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResponseMessage } from '@app/_models';
import { environment } from '@environments/environment';

import { MacPersona } from '@app/_models/Macred/Persona';
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
import {
  AnalisisHistoricoPD,
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
  VariablesPD,
} from '@app/_models/Macred';

@Injectable({ providedIn: 'root' })
export class MacredService {
  constructor(private http: HttpClient) {}

  getPersonaMacred(identificacionPersona: string, idCompania: number) {
    return this.http.get<MacPersona>(
      `${environment.apiUrl}/macred/getpersonaidentificacion?identificacionPersona=${identificacionPersona}&idCompania=${idCompania}`
    );
  }
  getPersonasCompania(idCompania: number) {
    return this.http.get<MacPersona[]>(
      `${environment.apiUrl}/macred/getpersonascompania?idCompania=${idCompania}`
    );
  }
  postPersona(persona: MacPersona) {
    return this.http.post<MacPersona>(
      `${environment.apiUrl}/macred/createpersona`,
      persona
    );
  }
  putPersona(persona: MacPersona) {
    return this.http.put<MacPersona>(
      `${environment.apiUrl}/macred/updatepersona`,
      persona
    );
  }
  deletePersona(idPersona: number) {
    return this.http.delete<MacPersona>(
      `${environment.apiUrl}/macred/deletepersona?idPersona=${idPersona}`
    );
  }
  getEstadosCivilesCompania(idCompania: number) {
    return this.http.get<MacEstadoCivil[]>(
      `${environment.apiUrl}/macred/getestadoscivilescompania?idCompania=${idCompania}`
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

  //#region NIVEL DE CAPACIDAD DE PAGO

  getNivelesCapacidadPago(idCompania: number, incluyeInactivos: boolean) {
    return this.http.get<MacNivelCapacidadPago[]>(
      `${environment.apiUrl}/macred/getnivelcapacidadpago?idCompania=${idCompania}&incluyeInactivos=${incluyeInactivos}`
    );
  }

  postNivelesCapacidadPago(nivelCapacidadPago: MacNivelCapacidadPago) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postnivelcapacidadpago`,
      nivelCapacidadPago
    );
  }

  putNivelesCapacidadPago(
    id: number,
    nivelCapacidadPago: MacNivelCapacidadPago
  ) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putnivelcapacidadpago/${id}`,
      nivelCapacidadPago
    );
  }

  //#endregion

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

  //#region VARIABLES

  getPDVariables(idCompania: number) {
    return this.http.get<VariablesPD[]>(
      `${environment.apiUrl}/macred/getPDVariables?idCompania=${idCompania}`
    );
  }

  createUpdatePDVariable(inVariablePD: VariablesPD) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/createUpdatePDVariable`,
      inVariablePD
    );
  }

  deletePDVariable(idPDVariable: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deletePDVariable?idPDVariable=${idPDVariable}`
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

  putTipoActividadEconomico(
    idTipoActividadEconomica: number,
    inTipoActividadEconomica: TipoActividadEconomica
  ) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putTipoActividadEconomico/${idTipoActividadEconomica}`,
      inTipoActividadEconomica
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

  //#region INDICADORES RELEVANTES

  getIndicadoresRelevantes(idCompania: number) {
    return this.http.get<MacIndicadoresRelevantes[]>(
      `${environment.apiUrl}/macred/getIndicadoresRelevantes?idCompania=${idCompania}`
    );
  }

  postIndicadoresRelevantes(inIndicadorRelevante: MacIndicadoresRelevantes) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postIndicadoresRelevantes`,
      inIndicadorRelevante
    );
  }

  putIndicadoresRelevantes(
    idIndicadorRelevante: number,
    inIndicadorRelevante: MacIndicadoresRelevantes
  ) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putIndicadoresRelevantes/${idIndicadorRelevante}`,
      inIndicadorRelevante
    );
  }

  deleteIndicadoresRelevantes(idIndicadorRelevante: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deleteIndicadoresRelevantes/${idIndicadorRelevante}`
    );
  }

  //#endregion

  //#region NIVELES X INDICADORES RELEVANTES

  getNivelesXIndicadoresRelevantes(idCompania: number, idIndicador: number) {
    return this.http.get<MacNivelesXIndicador[]>(
      `${environment.apiUrl}/macred/getNivelesXIndicadores/${idCompania}/${idIndicador}`
    );
  }

  postNivelesXIndicadoresRelevantes(
    inIndicadorRelevante: MacNivelesXIndicador
  ) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postNivelesXIndicadores`,
      inIndicadorRelevante
    );
  }

  deleteNivelesXIndicadoresRelevantes(
    idCompania: number,
    idIndicador: number,
    idNivel: number
  ) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deleteNivelesXIndicadores/${idCompania}/${idIndicador}/${idNivel}`
    );
  }

  //#endregion

  //#region VARIABES CRITICAS

  getVariablesCriticas(idCompania: number) {
    return this.http.get<MacVariablesCriticas[]>(
      `${environment.apiUrl}/macred/getVariablesCriticas/${idCompania}`
    );
  }

  postVariablesCriticas(inVariableCritica: MacVariablesCriticas) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postVariablesCriticas`,
      inVariableCritica
    );
  }

  putVariablesCriticas(
    idCodVariable: number,
    inVariableCritica: MacVariablesCriticas
  ) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/macred/putVariablesCriticas/${idCodVariable}`,
      inVariableCritica
    );
  }

  deleteVariablesCriticas(idCodVariable: number) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/macred/deleteVariablesCriticas/${idCodVariable}`
    );
  }

  //#endregion

  //#region ESCENARIOS DE RIESGOS

  getEscenariosRiesgos(idCompania: number) {
    return this.http.get<MacEscenariosRiesgos[]>(
      `${environment.apiUrl}/macred/getEscenariosRiesgo/${idCompania}`
    );
  }

  postEscenariosRiesgos(inVariableCritica: MacEscenariosRiesgos) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/macred/postEscenariosRiesgo`,
      inVariableCritica
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
