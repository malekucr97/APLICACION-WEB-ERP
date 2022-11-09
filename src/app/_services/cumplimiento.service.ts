import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Grupo } from '@app/_models/Cumplimiento/Grupo';
import { environment } from '@environments/environment';
import { ResponseMessage } from '@app/_models';
import { BehaviorSubject } from 'rxjs';
import { NivelRiesgo } from '@app/_models/Cumplimiento/NivelRiesgo';
import { ActividadEconomica } from '@app/_models/Cumplimiento/ActividadEconomica';
import { Profesion } from '@app/_models/Cumplimiento/Profesion';
import { Pais } from '@app/_models/Cumplimiento/Pais';
import { MovimientoDebeRiesgo } from '@app/_models/Cumplimiento/MovimientoDebeRiesgo';
import { MovimientoHaberRiesgo } from '@app/_models/Cumplimiento/MovimientoHaberRiesgo';
import { CantidadDebeRiesgo } from '@app/_models/Cumplimiento/CantidadDebeRiesgo';
import { CantidadHaberRiesgo } from '@app/_models/Cumplimiento/CantidadHaberRiesgo';
import { Articulo15 } from '@app/_models/Cumplimiento/Articulo15';
import { CanalDistribucion } from '@app/_models/Cumplimiento/CanalDistribucion';
import { Especialidad } from '@app/_models/Cumplimiento/Especialidad';
import { ProductoFinanciero } from '@app/_models/Cumplimiento/ProductoFinanciero';

@Injectable({ providedIn: 'root' })
export class CumplimientoService {

    // private listGroupsSubject : BehaviorSubject<Grupo[]> ;

    constructor( private http: HttpClient ) { }

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
    /**
     * Consulta los paises por compañia
     * @param idCompania 
     * @returns 
     */
     getCountriesBusiness(idCompania: number) {
        return this.http.get<Pais[]>(`${environment.apiUrl}/cumplimiento/paiscompania?idCompania=${idCompania}`);
    }
    /**
     * Consulta los movimientos debe riesgo por compañia
     * @param idCompania 
     * @returns 
     */
     getMovementsDebitBusiness(idCompania: number) {
        return this.http.get<MovimientoDebeRiesgo[]>(`${environment.apiUrl}/cumplimiento/movimientosdebecompania?idCompania=${idCompania}`);
    }
    /**
     * Consulta los movimientos haber riesgo por compañia
     * @param idCompania 
     * @returns 
     */
     getMovementsHavingBusiness(idCompania: number) {
        return this.http.get<MovimientoHaberRiesgo[]>(`${environment.apiUrl}/cumplimiento/movimientoshabercompania?idCompania=${idCompania}`);
    }
     /**
     * Consulta la cantidad de movimientos debe riesgo por compañia
     * @param idCompania 
     * @returns 
     */
      getQuantitiesDebitBusiness(idCompania: number) {
        return this.http.get<CantidadDebeRiesgo[]>(`${environment.apiUrl}/cumplimiento/cantidadesdebecompania?idCompania=${idCompania}`);
    }
    /**
     * Consulta la cantidad de movimientos haber riesgo por compañia
     * @param idCompania 
     * @returns 
     */
     getQuantitiesHavingBusiness(idCompania: number) {
        return this.http.get<CantidadHaberRiesgo[]>(`${environment.apiUrl}/cumplimiento/cantidadeshabercompania?idCompania=${idCompania}`);
    }
    /**
     * Consulta el articulo 15 de riesgo por compañia
     * @param idCompania 
     * @returns 
     */
     getArticle15Business(idCompania: number) {
        return this.http.get<Articulo15[]>(`${environment.apiUrl}/cumplimiento/articulo15compania?idCompania=${idCompania}`);
    }
    /**
     * Consulta los canales de distribucion de riesgo por compañia
     * @param idCompania 
     * @returns 
     */
     getDistributionChannelsBusiness(idCompania: number) {
        return this.http.get<CanalDistribucion[]>(`${environment.apiUrl}/cumplimiento/canalesdistribucioncompania?idCompania=${idCompania}`);
    }
    /**
     * Consulta las especialidades de riesgo por compañia
     * @param idCompania 
     * @returns 
     */
     getSpecialtiesBusiness(idCompania: number) {
        return this.http.get<Especialidad[]>(`${environment.apiUrl}/cumplimiento/especialidadescompania?idCompania=${idCompania}`);
    }
    /**
     * Consulta los productos financieros de riesgo por compañia
     * @param idCompania 
     * @returns 
     */
     getFinancialProductsBusiness(idCompania: number) {
        return this.http.get<ProductoFinanciero[]>(`${environment.apiUrl}/cumplimiento/productosfinancieroscompania?idCompania=${idCompania}`);
    }
}