import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Compania } from '../_models/modules/compania';
import { MenuModule, ResponseMessage } from '@app/_models/';

@Injectable({ providedIn: 'root' })
export class GeneralesService {

    constructor( private http: HttpClient ) { }

    putCompania(compania: Compania) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/generales/updatecompania`, compania);
    }

    getMenuGenerales(idModule:number) {
        return this.http.get<MenuModule[]>(`${environment.apiUrl}/generales/menugenerales?idModule=${idModule}`);
    }
    
}