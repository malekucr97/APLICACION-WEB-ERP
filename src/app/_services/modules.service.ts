import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

import { Module, ResponseMessage } from '@app/_models/';

@Injectable({ providedIn: 'root' })
export class ModulesService {

    constructor( private http: HttpClient ) { }

    assignModuleToBusiness(moduleToAssign: Module) {
        return this.http.post<ResponseMessage>(`${environment.apiUrl}/modules/assignmodbusiness`, moduleToAssign);
    }
    desAssignModuleToBusiness(moduleId:number, idBusiness:number) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/modules/desassignmodbusiness?idModule=${moduleId}&idBusiness=${idBusiness}`);
    }
    
}