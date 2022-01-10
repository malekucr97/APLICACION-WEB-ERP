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
        return today.getFullYear() + '/' + (today.getMonth()+1) + '/' + today.getDate() + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    }

    getCompaniaPorIdentificacion(identificacion: string) {
        return this.http.get<Compania>(`${environment.apiUrl}/users/empresaidentificacion?identificacion=${identificacion}`);
    }

    postRegistrarCompania(compania: Compania) {
        return this.http.post<ResponseMessage>(`${environment.apiUrl}/generales/registrarcompania`, compania);
    }
}