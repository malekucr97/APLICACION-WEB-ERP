import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Grupo } from '@app/_models/Cumplimiento/Grupo';
import { environment } from '@environments/environment';
import { ResponseMessage } from '@app/_models';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CumplimientoService {

    private listGroupsSubject : BehaviorSubject<Grupo[]> ;

    constructor( private http: HttpClient ) { }

// ******************************************************************************
    // ****************************** MÉTODOS ACCESORES *****************************
    // ******************************************************************************
    public get groupsListValue(): Grupo[] { 
        if (this.listGroupsSubject) {
            return this.listGroupsSubject.value;   
        }
        return null;
    }
    // -- >> Suscribe lista de grupos de riesgo
    public suscribeListGroups(listaGrupos : Grupo[]) : void {
        this.listGroupsSubject = new BehaviorSubject<Grupo[]>(listaGrupos);
    }
    
    getGroupsBusiness(idCompania: number) {
        return this.http.get<Grupo[]>(`${environment.apiUrl}/cumplimiento/cum_gruposcompania?idCompania=${idCompania}`);
    }
    update(group: Grupo) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/actualizarcompania`, group);
    }
}