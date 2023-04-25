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

import { MacEstadoCivil } from '@app/_models/Macred/MacEstadoCivil';
import { MacMatrizAceptacionIngreso } from '@app/_models/Macred/MatrizAceptacionIngreso';
import { MacTipoDeducciones } from '@app/_models/Macred/TipoDeduccion';
import { MacDeduccionesAnalisis } from '@app/_models/Macred/DeduccionAnalisis';

@Injectable({ providedIn: 'root' })
export class MacredService {

    constructor( private http: HttpClient ) { }

    getPersonaMacred(identificacionPersona: string, idCompania:number) {
        return this.http.get<MacPersona>(`${environment.apiUrl}/macred/getpersonaidentificacion?identificacionPersona=${identificacionPersona}&idCompania=${idCompania}`);
    }
    getPersonasCompania(idCompania:number) {
        return this.http.get<MacPersona[]>(`${environment.apiUrl}/macred/getpersonascompania?idCompania=${idCompania}`);
    }
    getEstadosCivilesCompania(idCompania:number) {
        return this.http.get<MacEstadoCivil[]>(`${environment.apiUrl}/macred/getestadoscivilescompania?idCompania=${idCompania}`);
    }

    getTiposIngresoAnalisis(idCompania: number) {
        return this.http.get<MacTipoIngresoAnalisis[]>(`${environment.apiUrl}/macred/gettipoingresoanalisis?idCompania=${idCompania}`);
    }
    getTiposFormaPagoAnalisis(idCompania: number) {
        return this.http.get<MacTipoFormaPagoAnalisis[]>(`${environment.apiUrl}/macred/gettipoformapagoanalisis?idCompania=${idCompania}`);
    }
    GetParametroGeneralVal1(idCompania: number, codParametro:string, esNumerico:boolean) {
        return this.http.get<string>(`${environment.apiUrl}/macred/getparametrogeneralval1?idCompania=${idCompania}&codParametro=${codParametro}&esNumerico=${esNumerico}`);
    }
    getCodigoCategoriaCreditoPersona(idCompania: number, idPersona:number) {
        return this.http.get<string>(`${environment.apiUrl}/macred/getcodcategoriacredito?idCompania=${idCompania}&idPersona=${idPersona}`);
    }
    getTiposMonedas(idCompania: number) {
        return this.http.get<MacTiposMoneda[]>(`${environment.apiUrl}/macred/gettiposmonedas?idCompania=${idCompania}`);
    }
    getModelosAnalisis(idCompania: number, incluyeInactivos:boolean) {
        return this.http.get<MacModeloAnalisis[]>(`${environment.apiUrl}/macred/getmodelosanalisis?idCompania=${idCompania}&incluyeInactivos=${incluyeInactivos}`);
    }
    getNivelesCapacidadPago(idCompania: number, incluyeInactivos:boolean) {
        return this.http.get<MacNivelCapacidadPago[]>(`${environment.apiUrl}/macred/getnivelcapacidadpago?idCompania=${idCompania}&incluyeInactivos=${incluyeInactivos}`);
    }
    getTiposGenerador(idCompania: number, incluyeInactivos:boolean) {
        return this.http.get<MacTipoGenerador[]>(`${environment.apiUrl}/macred/gettiposgeneradores?idCompania=${idCompania}&incluyeInactivos=${incluyeInactivos}`);
    }
    postAnalisisCapPago(analisis:MacAnalisisCapacidadPago) {
        return this.http.post<MacAnalisisCapacidadPago>(`${environment.apiUrl}/macred/createanalisiscapacidadpago`, analisis);
    }
    putAnalisisCapPago(analisis:MacAnalisisCapacidadPago) {
        return this.http.put<MacAnalisisCapacidadPago>(`${environment.apiUrl}/macred/updateanalisiscapacidadpago`, analisis);
    }

    getTiposIngresos(idCompania: number, incluyeInactivos:boolean) {
        return this.http.get<MacTipoIngreso[]>(`${environment.apiUrl}/macred/gettiposingresos?idCompania=${idCompania}&incluyeInactivos=${incluyeInactivos}`);
    }
    getIngresosAnalisis(idCompania: number, codigoAnalisis:number) {
        return this.http.get<MacIngresosXAnalisis[]>(`${environment.apiUrl}/macred/getingresosanalisis?idCompania=${idCompania}&codigoAnalisis=${codigoAnalisis}`);
    }
    getExtrasAplicables(idCompania: number, codigoAnalisis:number) {
        return this.http.get<MacExtrasAplicables[]>(`${environment.apiUrl}/macred/getextrasaplicanles?idCompania=${idCompania}&codigoAnalisis=${codigoAnalisis}`);
    }
    postExtrasAplicables(extras:MacExtrasAplicables) {
        return this.http.post<MacExtrasAplicables>(`${environment.apiUrl}/macred/createextrasaplicables`, extras);
    }
    getHistorialAnlisis(idCompania: number) {
        return this.http.get<MacAnalisisCapacidadPago[]>(`${environment.apiUrl}/macred/gethistorialcapacidadpago?idCompania=${idCompania}`);
    }
    getMatrizAceptacionIngreso(idCompania: number, incluyeInactivos:boolean) {
        return this.http.get<MacMatrizAceptacionIngreso[]>(`${environment.apiUrl}/macred/getmatrizaceptacioningreso?idCompania=${idCompania}&incluyeInactivos=${incluyeInactivos}`);
    }
    getExtrasAnalisisIngreso(idCompania: number, codigoAnalisis:number, idIngreso:number) {
        return this.http.get<MacExtrasAplicables>(`${environment.apiUrl}/macred/getextrasanalisisingreso?idCompania=${idCompania}&codigoAnalisis=${codigoAnalisis}&idIngreso=${idIngreso}`);
    } 
    
    getTiposDeducciones(idCompania: number, incluyeInactivos:boolean) {
        return this.http.get<MacTipoDeducciones[]>(`${environment.apiUrl}/macred/gettiposdeducciones?idCompania=${idCompania}&incluyeInactivos=${incluyeInactivos}`);
    }
    postDeduccionesAnalisis(deduccion:MacDeduccionesAnalisis) {
        return this.http.post<MacDeduccionesAnalisis>(`${environment.apiUrl}/macred/creatededuccionesanalisis`, deduccion);
    }
    getDeduccionesAnalisisPorIngreso(idCompania: number, codigoAnalisis:number, idIngreso:number) {
        return this.http.get<MacDeduccionesAnalisis[]>(`${environment.apiUrl}/macred/getdeduccionesanalisisingreso?idCompania=${idCompania}&codigoAnalisis=${codigoAnalisis}&idIngreso=${idIngreso}`);
    }
    getDeduccionesAnalisis(idCompania: number, codigoAnalisis:number) {
        return this.http.get<MacDeduccionesAnalisis[]>(`${environment.apiUrl}/macred/getdeduccionesanalisis?idCompania=${idCompania}&codigoAnalisis=${codigoAnalisis}`);
    }
    postIngresosAnalisis(ingresoAnalisis:MacIngresosXAnalisis) {
        return this.http.post<MacIngresosXAnalisis>(`${environment.apiUrl}/macred/createingresosanalisis`, ingresoAnalisis);
    }
    putIngresosAnalisis(ingresoAnalisis:MacIngresosXAnalisis) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/macred/updateingresosanalisis`, ingresoAnalisis);
    }
    putDeduccionAnalisis(deduccionAnalisis:MacDeduccionesAnalisis) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/macred/updatededuccionanalisis`, deduccionAnalisis);
    }
    deleteExtra( idExtras : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/macred/eliminarextrasaplicables?idExtras=${idExtras}`);
    }
    deleteDeduccion( idDeduccion : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/macred/eliminardeduccioningreso?idDeduccion=${idDeduccion}`);
    }
    deleteIngreso( idIngreso : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/macred/eliminaringresoanalisis?idIngreso=${idIngreso}`);
    }
}