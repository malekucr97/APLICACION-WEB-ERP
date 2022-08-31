import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Grupo } from '@app/_models/Cumplimiento/Grupo';
import { environment } from '@environments/environment';
import { ResponseMessage } from '@app/_models';
import { BehaviorSubject } from 'rxjs';
import { NivelRiesgo } from '@app/_models/Cumplimiento/NivelRiesgo';
import { ActividadEconomica } from '@app/_models/Cumplimiento/ActividadEconomica';
import { Profesion } from '@app/_models/Cumplimiento/Profesion';

@Injectable({ providedIn: 'root' })
export class CumplimientoService {

    private listGroupsSubject : BehaviorSubject<Grupo[]> ;

    constructor( private http: HttpClient ) { }

// ******************************************************************************
    // ****************************** MÉTODOS ACCESORES *****************************
    // ******************************************************************************
    /*public get groupsListValue(): Grupo[] { 
        if (this.listGroupsSubject) {
            return this.listGroupsSubject.value;   
        }
        return null;
    }*/
    // -- >> Suscribe lista de grupos de riesgo
    /*public suscribeListGroups(listaGrupos : Grupo[]) : void {
        this.listGroupsSubject = new BehaviorSubject<Grupo[]>(listaGrupos);
    }*/
    
    getGroupsBusiness(idCompania: number) {
        return this.http.get<Grupo[]>(`${environment.apiUrl}/cumplimiento/gruposriesgocompania?idCompania=${idCompania}`);
    }
    update(group: Grupo) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/cumplimiento/`, group);
    }
    /**
     * Consulta los niveles de riesgo por compañia
     * @param idCompania 
     * @returns 
     */
     getRiskLevelBusiness(idCompania: number) {
        return this.http.get<NivelRiesgo[]>(`${environment.apiUrl}/cumplimiento/nivelriesgoscompania?idCompania=${idCompania}`);
    }
    /**
     * Consulta las actividades economicas por compañia
     * @param idCompania 
     * @returns 
     */
     getEconomicActivityBusiness(idCompania: number) {
        return this.http.get<ActividadEconomica[]>(`${environment.apiUrl}/cumplimiento/actividadeconomicacompania?idCompania=${idCompania}`);
    }
    /**
     * Consulta las profesiones por compañia
     * @param idCompania 
     * @returns 
     */
     getProfesionBusiness(idCompania: number) {
        return this.http.get<Profesion[]>(`${environment.apiUrl}/cumplimiento/profesioncompania?idCompania=${idCompania}`);
    }
}