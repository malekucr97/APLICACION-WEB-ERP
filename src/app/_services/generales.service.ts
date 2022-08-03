import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Compania } from '../_models/modules/compania';
import { ResponseMessage } from '@app/_models/';

@Injectable({ providedIn: 'root' })
export class GeneralesService {

    constructor( private http: HttpClient ) { }

    putCompania(compania: Compania) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/generales/updatecompania`, compania);
    }
}