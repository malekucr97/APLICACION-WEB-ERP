import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResponseMessage } from '@app/_models';
import { environment } from '@environments/environment';
import { InvTipoMoneda } from '@app/_models/Inversiones/TipoMoneda';
import { InvTipoPersona } from '@app/_models/Inversiones/TipoPersona';
import { InvPersona } from '@app/_models/Inversiones/Persona';
import { InvMontoMaximoPersona } from '@app/_models/Inversiones/MontoMaximoPersona';
import { InvTipoCambio } from '@app/_models/Inversiones/TipoCambio';
import { InvPeriocidad } from '@app/_models/Inversiones/Periocidad';
import { InvTipoAnio } from '@app/_models/Inversiones/TipoAnio';
import { InvTipoMercado } from '@app/_models/Inversiones/TipoMercado';
import { InvTipoSector } from '@app/_models/Inversiones/TipoSector';
import { InvEmisor } from '@app/_models/Inversiones/Emisor';
import { InvPlazoInversion } from '@app/_models/Inversiones/PlazoInversion';
import { InvTitulo } from '@app/_models/Inversiones/Titulo';
import { InvClaseInversion } from '@app/_models/Inversiones/ClaseInversion';
import { InvTasa } from '@app/_models/Inversiones/Tasa';

@Injectable({ providedIn: 'root' })
export class InversionesService {
    constructor( private http: HttpClient ) { }


    // *********************************
    // MANTENIMIENTO DE TIPOS DE MONEDAS
    getTiposMonedas(codigoMoneda: string, idCompania:number, soloActivos : boolean) {
        return this.http.get<InvTipoMoneda[]>(`${environment.apiUrl}/inversiones/gettipomonedacodigo?codigoMoneda=${codigoMoneda}&idCompania=${idCompania}&soloActivos=${soloActivos}`);
    }
    postTipoMoneda(moneda:InvTipoMoneda) {
        return this.http.post<InvTipoMoneda>(`${environment.apiUrl}/inversiones/createtipomoneda`, moneda);
    }
    putTipoMoneda(moneda:InvTipoMoneda) {
        return this.http.put<InvTipoMoneda>(`${environment.apiUrl}/inversiones/updatetipomoneda`, moneda);
    }
    deleteTipoMoneda( id : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/inversiones/deletetipomoneda?id=${id}`);
    }
    // *********************************
    // *********************************
    // MANTENIMIENTO DE TIPOS DE PERSONAS
    getTiposPersonaDescripcion(descTipoPersona: string, idCompania:number, soloActivos : boolean) {
        return this.http.get<InvTipoPersona[]>(`${environment.apiUrl}/inversiones/gettipopersonadescripcion?descTipoPersona=${descTipoPersona}&idCompania=${idCompania}&soloActivos=${soloActivos}`);
    }
    postTipoPersona(tpersona:InvTipoPersona) {
        return this.http.post<InvTipoPersona>(`${environment.apiUrl}/inversiones/createtipopersona`, tpersona);
    }
    putTipoPersona(moneda:InvTipoPersona) {
        return this.http.put<InvTipoPersona>(`${environment.apiUrl}/inversiones/updatetipopersona`, moneda);
    }
    deleteTipoPersona( id : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/inversiones/deletetipopersona?id=${id}`);
    }
    // *********************************
    // *********************************
    // MANTENIMIENTO DE PERSONAS
    getPersonaIdentificacion(identificacion: string, idCompania:number, soloActivos : boolean) {
        return this.http.get<InvPersona[]>(`${environment.apiUrl}/inversiones/getpersonaidentificacion?identificacion=${identificacion}&idCompania=${idCompania}&soloActivos=${soloActivos}`);
    }
    postPersona(objeto:InvPersona) {
        return this.http.post<InvPersona>(`${environment.apiUrl}/inversiones/createpersona`, objeto);
    }
    putPersona(objeto:InvPersona) {
        return this.http.put<InvPersona>(`${environment.apiUrl}/inversiones/updatepersona`, objeto);
    }
    deletePersona( id : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/inversiones/deletepersona?id=${id}`);
    }
    // *********************************
    // *********************************
    // MANTENIMIENTO DE MONTOS DE PERSONAS
    getMontosPersona(idPersona: number, idCompania:number) {
        return this.http.get<InvMontoMaximoPersona[]>(`${environment.apiUrl}/inversiones/getmontospersona?idPersona=${idPersona}&idCompania=${idCompania}`);
    }
    postMontosPersona(objeto:InvMontoMaximoPersona) {
        return this.http.post<InvMontoMaximoPersona>(`${environment.apiUrl}/inversiones/createmontomaximo`, objeto);
    }
    putMontoPersona(objeto:InvMontoMaximoPersona) {
        return this.http.put<InvMontoMaximoPersona>(`${environment.apiUrl}/inversiones/updatemontomaximo`, objeto);
    }
    deleteMontoPersona( id : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/inversiones/deletemontomaximo?id=${id}`);
    }
    // *********************************
    // *********************************
    // MANTENIMIENTO DE TIPO DE CAMBIO
    getTipoCambio(idMoneda: number, idCompania:number, fechaConsulta:string) {
        return this.http.get<InvTipoCambio[]>(`${environment.apiUrl}/inversiones/gettipocambio?idMoneda=${idMoneda}&idCompania=${idCompania}&fechaConsulta=${fechaConsulta}`);
    }
    postTipoCambio(objeto:InvTipoCambio) {
        return this.http.post<InvTipoCambio>(`${environment.apiUrl}/inversiones/createtipocambio`, objeto);
    }
    putTipoCambio(objeto:InvTipoCambio) {
        return this.http.put<InvTipoCambio>(`${environment.apiUrl}/inversiones/updatetipocambio`, objeto);
    }
    deleteTipoCambio( id : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/inversiones/deletetipocambio?id=${id}`);
    }
    requestTipoCambioBCCR(bccrIndicadorCompra: number, bccrIndicadorVenta: number, idMoneda: number, idCompania: number, fechaConsulta: string) {
        return this.http.get<InvTipoCambio>(`${environment.apiUrl}/inversiones/requestwstipocambio?indCompra=${bccrIndicadorCompra}&indVenta=${bccrIndicadorVenta}&idMoneda=${idMoneda}&idCompania=${idCompania}&fechaConsulta=${fechaConsulta}`);
    }
    // *********************************
    // *********************************
    // MANTENIMIENTO DE PERIOCIDADES
    getPeriocidad(codigoPeriocidad: string, idCompania:number, soloActivos : boolean) {
        return this.http.get<InvPeriocidad[]>(`${environment.apiUrl}/inversiones/getperiocidad?codigoPeriocidad=${codigoPeriocidad}&idCompania=${idCompania}&soloActivos=${soloActivos}`);
    }
    postPeriocidad(objeto:InvPeriocidad) {
        return this.http.post<InvPeriocidad>(`${environment.apiUrl}/inversiones/createperiocidad`, objeto);
    }
    putPeriocidad(objeto:InvPeriocidad) {
        return this.http.put<InvPeriocidad>(`${environment.apiUrl}/inversiones/updateperiocidad`, objeto);
    }
    deletePeriocidad( id : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/inversiones/deleteperiocidad?id=${id}`);
    }
    // *********************************
    // *********************************
    // MANTENIMIENTO DE PERIOCIDADES
    getTipoAnio(descripcion: string, idCompania:number, soloActivos : boolean) {
        return this.http.get<InvTipoAnio[]>(`${environment.apiUrl}/inversiones/gettipoanio?descripcion=${descripcion}&idCompania=${idCompania}&soloActivos=${soloActivos}`);
    }
    postTipoAnio(objeto:InvTipoAnio) {
        return this.http.post<InvTipoAnio>(`${environment.apiUrl}/inversiones/createtipoanio`, objeto);
    }
    putTipoAnio(objeto:InvTipoAnio) {
        return this.http.put<InvTipoAnio>(`${environment.apiUrl}/inversiones/updatetipoanio`, objeto);
    }
    deleteTipoAnio( id : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/inversiones/deletetipoanio?id=${id}`);
    }
    // *********************************
    // *********************************
    // MANTENIMIENTO DE TIPOS DE MERCADOS
    getTipoMercado(codigoMercado: string, idCompania:number, soloActivos : boolean) {
        return this.http.get<InvTipoMercado[]>(`${environment.apiUrl}/inversiones/gettipomercado?codigoMercado=${codigoMercado}&idCompania=${idCompania}&soloActivos=${soloActivos}`);
    }
    postTipoMercado(objeto:InvTipoMercado) {
        return this.http.post<InvTipoMercado>(`${environment.apiUrl}/inversiones/createtipomercado`, objeto);
    }
    putTipoMercado(objeto:InvTipoMercado) {
        return this.http.put<InvTipoMercado>(`${environment.apiUrl}/inversiones/updatetipomercado`, objeto);
    }
    deleteTipoMercado( id : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/inversiones/deletetipomercado?id=${id}`);
    }
    // *********************************
    // *********************************
    // MANTENIMIENTO DE TIPOS DE SECTORES
    getTipoSector(codigoSector: string, idCompania:number, soloActivos : boolean) {
        return this.http.get<InvTipoSector[]>(`${environment.apiUrl}/inversiones/gettiposector?codigoSector=${codigoSector}&idCompania=${idCompania}&soloActivos=${soloActivos}`);
    }
    postTipoSector(objeto:InvTipoSector) {
        return this.http.post<InvTipoSector>(`${environment.apiUrl}/inversiones/createtiposector`, objeto);
    }
    putTipoSector(objeto:InvTipoSector) {
        return this.http.put<InvTipoSector>(`${environment.apiUrl}/inversiones/updatetiposector`, objeto);
    }
    deleteTipoSector( id : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/inversiones/deletetiposector?id=${id}`);
    }
    // *********************************
    // *********************************
    // MANTENIMIENTO DE EMISORES
    getEmisor(descripcion: string, idCompania:number, soloActivos : boolean) {
        return this.http.get<InvEmisor[]>(`${environment.apiUrl}/inversiones/getemisor?descripcion=${descripcion}&idCompania=${idCompania}&soloActivos=${soloActivos}`);
    }
    postEmisor(objeto:InvEmisor) {
        return this.http.post<InvEmisor>(`${environment.apiUrl}/inversiones/createemisor`, objeto);
    }
    putEmisor(objeto:InvEmisor) {
        return this.http.put<InvEmisor>(`${environment.apiUrl}/inversiones/updateemisor`, objeto);
    }
    deleteEmisor( id : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/inversiones/deleteemisor?id=${id}`);
    }
    // *********************************
    // *********************************
    // MANTENIMIENTO DE PLAZOS DE INVERSIÓN
    getPlazoInversion(descripcion: string, idCompania:number, soloActivos : boolean) {
        return this.http.get<InvPlazoInversion[]>(`${environment.apiUrl}/inversiones/getplazoinversion?descripcion=${descripcion}&idCompania=${idCompania}&soloActivos=${soloActivos}`);
    }
    postPlazoInversion(objeto:InvPlazoInversion) {
        return this.http.post<InvPlazoInversion>(`${environment.apiUrl}/inversiones/createplazoinversion`, objeto);
    }
    putPlazoInversion(objeto:InvPlazoInversion) {
        return this.http.put<InvPlazoInversion>(`${environment.apiUrl}/inversiones/updateplazoinversion`, objeto);
    }
    deletePlazoInversion( id : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/inversiones/deleteplazoinversion?id=${id}`);
    }
    // *********************************
    // *********************************
    // MANTENIMIENTO DE TITULOS
    getTitulo(descripcion: string, idCompania:number, soloActivos : boolean) {
        return this.http.get<InvTitulo[]>(`${environment.apiUrl}/inversiones/gettitulo?descripcion=${descripcion}&idCompania=${idCompania}&soloActivos=${soloActivos}`);
    }
    postTitulo(objeto:InvTitulo) {
        return this.http.post<InvTitulo>(`${environment.apiUrl}/inversiones/createtitulo`, objeto);
    }
    putTitulo(objeto:InvTitulo) {
        return this.http.put<InvTitulo>(`${environment.apiUrl}/inversiones/updatetitulo`, objeto);
    }
    deleteTitulo( id : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/inversiones/deletetitulo?id=${id}`);
    }
    // *********************************
    // *********************************
    // MANTENIMIENTO DE CLASES DE INVERSIÓN
    getClaseInversion(descripcion: string, idCompania:number, soloActivos : boolean) {
        return this.http.get<InvClaseInversion[]>(`${environment.apiUrl}/inversiones/getclaseinversion?descripcion=${descripcion}&idCompania=${idCompania}&soloActivos=${soloActivos}`);
    }
    postClaseInversion(objeto:InvClaseInversion) {
        return this.http.post<InvClaseInversion>(`${environment.apiUrl}/inversiones/createclaseinversion`, objeto);
    }
    putClaseInversion(objeto:InvClaseInversion) {
        return this.http.put<InvClaseInversion>(`${environment.apiUrl}/inversiones/updateclaseinversion`, objeto);
    }
    deleteClaseInversion( id : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/inversiones/deleteclaseinversion?id=${id}`);
    }
    // *********************************
    // *********************************
    // MANTENIMIENTO DE TASAS
    getTasa(descripcion: string, idCompania:number, soloActivos : boolean) {
        return this.http.get<InvTasa[]>(`${environment.apiUrl}/inversiones/gettasa?descripcion=${descripcion}&idCompania=${idCompania}&soloActivos=${soloActivos}`);
    }
    postTasa(objeto:InvTasa) {
        return this.http.post<InvTasa>(`${environment.apiUrl}/inversiones/createtasa`, objeto);
    }
    putTasa(objeto:InvTasa) {
        return this.http.put<InvTasa>(`${environment.apiUrl}/inversiones/updatetasa`, objeto);
    }
    deleteTasa( id : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/inversiones/deletetasa?id=${id}`);
    }
    // *********************************
}