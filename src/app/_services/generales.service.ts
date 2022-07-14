import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Compania } from '../_models/modules/compania';
import { ResponseMessage } from '@app/_models/';

@Injectable({ providedIn: 'root' })
export class GeneralesService {

    constructor( private http: HttpClient ) { }

    // getCompaniaPorIdentificacion(identificacion: string) {
    //     return this.http.get<Compania>(`${environment.apiUrl}/generales/empresaidentificacion?identificacion=${identificacion}`);
    // }

    putCompania(compania: Compania) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/generales/putcompania`, compania);
    }
}