import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Grupo } from '@app/_models/Cumplimiento/Grupo';
import { environment } from '@environments/environment';
import { ResponseMessage } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class CumplimientoService {

    constructor( private http: HttpClient ) { }

    getGroupsBusiness(idCompania: number) {
        return this.http.get<Grupo[]>(`${environment.apiUrl}/cumplimiento/cum_gruposcompania?idCompania=${idCompania}`);
    }
    update(group: Grupo) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/actualizarcompania`, group);
    }
}