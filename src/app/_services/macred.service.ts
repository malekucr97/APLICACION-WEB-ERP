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
import { MacTipoPersona } from '@app/_models/Macred/TipoPersona';
import { MacTipoGenero } from '@app/_models/Macred/TipoGenero';
import { MacCondicionLaboral } from '@app/_models/Macred/CondicionLaboral';
import { MacCategoriaCredito } from '@app/_models/Macred/CategoriaCredito';
import { MacTipoAsociado } from '@app/_models/Macred/TipoAsociado';
import { MacTipoHabitacion } from '@app/_models/Macred/TipoHabitacion';

@Injectable({ providedIn: 'root' })
export class MacredService {

    constructor( private http: HttpClient ) { }

    getPersonaMacred(identificacionPersona: string, idCompania:number) {
        return this.http.get<MacPersona>(`${environment.apiUrl}/macred/getpersonaidentificacion?identificacionPersona=${identificacionPersona}&idCompania=${idCompania}`);
    }
    getPersonasCompania(idCompania:number) {
        return this.http.get<MacPersona[]>(`${environment.apiUrl}/macred/getpersonascompania?idCompania=${idCompania}`);
    }
    postPersona(persona:MacPersona) {
        return this.http.post<MacPersona>(`${environment.apiUrl}/macred/createpersona`, persona);
    }
    putPersona(persona:MacPersona) {
        return this.http.put<MacPersona>(`${environment.apiUrl}/macred/updatepersona`, persona);
    }
    deletePersona(idPersona:number) {
        return this.http.delete<MacPersona>(`${environment.apiUrl}/macred/deletepersona?idPersona=${idPersona}`);
    }
    getEstadosCivilesCompania(idCompania:number) {
        return this.http.get<MacEstadoCivil[]>(`${environment.apiUrl}/macred/getestadoscivilescompania?idCompania=${idCompania}`);
    }
    postEstadoCivil(estadoCivil:MacEstadoCivil) {
        return this.http.post<MacEstadoCivil>(`${environment.apiUrl}/macred/createestadocivil`, estadoCivil);
    }
    putEstadoCivil(estadoCivil:MacEstadoCivil) {
        return this.http.put<MacEstadoCivil>(`${environment.apiUrl}/macred/updateestadocivil`, estadoCivil);
    }
    deleteEstadoCivil(idEstadoCivil:number) {
        return this.http.delete<MacEstadoCivil>(`${environment.apiUrl}/macred/deleteestadocivil?idEstadoCivil=${idEstadoCivil}`);
    }
    getTiposPersonasCompania(idCompania:number) {
        return this.http.get<MacTipoPersona[]>(`${environment.apiUrl}/macred/gettipospersonascompania?idCompania=${idCompania}`);
    }
    getTiposGenerosCompania(idCompania:number) {
        return this.http.get<MacTipoGenero[]>(`${environment.apiUrl}/macred/gettiposgeneroscompania?idCompania=${idCompania}`);
    }
    getCondicionesLaboralesCompania(idCompania:number) {
        return this.http.get<MacCondicionLaboral[]>(`${environment.apiUrl}/macred/getcondicioneslaboralescompania?idCompania=${idCompania}`);
    }
    getCategoriasCreditosCompania(idCompania:number) {
        return this.http.get<MacCategoriaCredito[]>(`${environment.apiUrl}/macred/getcategoriascreditoscompania?idCompania=${idCompania}`);
    }
    getTiposAsociadosCompania(idCompania:number) {
        return this.http.get<MacTipoAsociado[]>(`${environment.apiUrl}/macred/gettiposasociadoscompania?idCompania=${idCompania}`);
    }
    getTiposHabitacionesCompania(idCompania:number) {
        return this.http.get<MacTipoHabitacion[]>(`${environment.apiUrl}/macred/gettiposhabitacionescompania?idCompania=${idCompania}`);
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
}