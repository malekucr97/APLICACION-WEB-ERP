import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Compania } from '../_models/modules/compania';
import { ResponseMessage } from '@app/_models/';

@Injectable({ providedIn: 'root' })
export class GeneralesService {

    constructor( private http: HttpClient ) { }

    obtenerFechaActual() {
        let today = new Date(); 
        return today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate() + 'T' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    }

    getCompaniaPorIdentificacion(identificacion: string) {
        return this.http.get<Compania>(`${environment.apiUrl}/generales/empresaidentificacion?identificacion=${identificacion}`);
    }

    putCompania(compania: Compania) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/generales/putcompania`, compania);
    }
}