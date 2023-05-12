import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResponseMessage } from '@app/_models';
import { environment } from '@environments/environment';
import { InvTipoMoneda } from '@app/_models/Inversiones/TipoMoneda';

@Injectable({ providedIn: 'root' })
export class InversionesService {
    constructor( private http: HttpClient ) { }

    getTiposMonedasInversiones(codigoMoneda: string, idCompania:number, soloActivos : boolean) {
        return this.http.get<InvTipoMoneda[]>(`${environment.apiUrl}/inversiones/gettipomonedacodigo?codigoMoneda=${codigoMoneda}&idCompania=${idCompania}&soloActivos=${soloActivos}`);
    }
    postTipoMoneda(moneda:InvTipoMoneda) {
        return this.http.post<InvTipoMoneda>(`${environment.apiUrl}/inversiones/createtipomoneda`, moneda);
    }
    putTipoMoneda(moneda:InvTipoMoneda) {
        return this.http.put<InvTipoMoneda>(`${environment.apiUrl}/inversiones/updatetipomoneda`, moneda);
    }
    deleteTipoMoneda( idMoneda : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/inversiones/deletetipomoneda?idMoneda=${idMoneda}`);
    }
}