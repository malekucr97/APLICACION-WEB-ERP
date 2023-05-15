import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResponseMessage } from '@app/_models';
import { environment } from '@environments/environment';
import { InvTipoMoneda } from '@app/_models/Inversiones/TipoMoneda';
import { InvTipoPersona } from '@app/_models/Inversiones/TipoPersona';

@Injectable({ providedIn: 'root' })
export class InversionesService {
    constructor( private http: HttpClient ) { }


    // *********************************
    // MANTENIMIENTO DE TIPOS DE MONEDAS
    getTiposMonedas(codigoMoneda: string, idCompania:number, soloActivos : boolean) {
        return this.http.get<InvTipoMoneda[]>(`${environment.apiUrl}/inversiones/gettipomonedacodigo?codigoMoneda=${codigoMoneda}&idCompania=${idCompania}&soloActivos=${soloActivos}`);
    }
    postTipoMoneda(moneda:InvTipoMoneda) {
        return this.http.post<InvTipoMoneda>(`${environment.apiUrl}/inversiones/createtipomoneda`, moneda);
    }
    putTipoMoneda(moneda:InvTipoMoneda) {
        return this.http.put<InvTipoMoneda>(`${environment.apiUrl}/inversiones/updatetipomoneda`, moneda);
    }
    deleteTipoMoneda( id : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/inversiones/deletetipomoneda?id=${id}`);
    }
    // *********************************
    // *********************************
    // MANTENIMIENTO DE TIPOS DE PERSONAS
    getTiposPersonaDescripcion(descTipoPersona: string, idCompania:number, soloActivos : boolean) {
        return this.http.get<InvTipoPersona[]>(`${environment.apiUrl}/inversiones/gettipopersonadescripcion?descTipoPersona=${descTipoPersona}&idCompania=${idCompania}&soloActivos=${soloActivos}`);
    }
    postTipoPersona(tpersona:InvTipoPersona) {
        return this.http.post<InvTipoPersona>(`${environment.apiUrl}/inversiones/createtipopersona`, tpersona);
    }
    putTipoPersona(moneda:InvTipoPersona) {
        return this.http.put<InvTipoPersona>(`${environment.apiUrl}/inversiones/updatetipopersona`, moneda);
    }
    deleteTipoPersona( id : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/inversiones/deletetipopersona?id=${id}`);
    }
    // *********************************
}