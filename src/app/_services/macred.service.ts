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

@Injectable({ providedIn: 'root' })
export class MacredService {

    constructor( private http: HttpClient ) { }

    getPersonaMacred(identificacionPersona: string, idCompania:number) {
        return this.http.get<MacPersona>(`${environment.apiUrl}/macred/getpersonaidentificacion?identificacionPersona=${identificacionPersona}&idCompania=${idCompania}`);
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

    getTiposIngresos(idCompania: number, incluyeInactivos:boolean) {
        return this.http.get<MacTipoIngreso[]>(`${environment.apiUrl}/macred/gettiposingresos?idCompania=${idCompania}&incluyeInactivos=${incluyeInactivos}`);
    }
}