import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Compania } from '../_models/modules/compania';
import { ArchivoCarga, HojasExcel, ResponseMessage } from '@app/_models/';
import { GenTipoMoneda } from '@app/_models/Generales/TipoMoneda';
import { GenTipoCambio } from '@app/_models/Generales/TipoCambio';

@Injectable({ providedIn: 'root' })
export class GeneralesService {
  constructor(private http: HttpClient) {}

  putCompania(compania: Compania) {
    return this.http.put<ResponseMessage>( `${environment.apiUrl}/generales/updatecompania`, compania )
  }

  postCargaArchivo(body: FormData) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/generales/CargaArchivo`,
      body
    );
  }

  getCargasArchivosPorModulos(archivoCarga: ArchivoCarga) {
    return this.http.get<ArchivoCarga[]>(
      `${environment.apiUrl}/generales/GetCargasArchivosPorModulos`,
      {
        params: {
          IdModulo: archivoCarga.IdModulo,
          IdCompania: archivoCarga.IdCompania,
        },
      }
    );
  }

  getHojasExcel(archivoCarga: ArchivoCarga) {
    return this.http.get<HojasExcel[]>(
      `${environment.apiUrl}/generales/GetHojasExcel`,
      {
        params: {
          IdArchivo: archivoCarga.Id,
        },
      }
    );
  }

  // *********************************
  // MANTENIMIENTO DE TIPOS DE MONEDAS
  getTiposMonedas(codigoMoneda: string, idCompania:number, soloActivos : boolean) {
    return this.http.get<GenTipoMoneda[]>(`${environment.apiUrl}/generales/gettipomonedacodigo?codigoMoneda=${codigoMoneda}&idCompania=${idCompania}&soloActivos=${soloActivos}`);
  }
  postTipoMoneda(moneda:GenTipoMoneda) {
      return this.http.post<GenTipoMoneda>(`${environment.apiUrl}/generales/createtipomoneda`, moneda);
  }
  putTipoMoneda(moneda:GenTipoMoneda) {
      return this.http.put<GenTipoMoneda>(`${environment.apiUrl}/generales/updatetipomoneda`, moneda);
  }
  deleteTipoMoneda( id : number ) {
      return this.http.delete<ResponseMessage>(`${environment.apiUrl}/generales/deletetipomoneda?id=${id}`);
  }
  // *********************************
    // *********************************
    // MANTENIMIENTO DE TIPO DE CAMBIO
    getTipoCambio(idMoneda: number, idCompania:number, fechaConsulta:string) {
      return this.http.get<GenTipoCambio[]>(`${environment.apiUrl}/generales/gettipocambio?idMoneda=${idMoneda}&idCompania=${idCompania}&fechaConsulta=${fechaConsulta}`);
  }
  postTipoCambio(objeto:GenTipoCambio) {
      return this.http.post<GenTipoCambio>(`${environment.apiUrl}/generales/createtipocambio`, objeto);
  }
  putTipoCambio(objeto:GenTipoCambio) {
      return this.http.put<GenTipoCambio>(`${environment.apiUrl}/generales/updatetipocambio`, objeto);
  }
  deleteTipoCambio( id : number ) {
      return this.http.delete<ResponseMessage>(`${environment.apiUrl}/generales/deletetipocambio?id=${id}`);
  }
  requestTipoCambioBCCR(bccrIndicadorCompra: number, bccrIndicadorVenta: number, idMoneda: number, idCompania: number, fechaConsulta: string) {
      return this.http.get<GenTipoCambio>(`${environment.apiUrl}/generales/requestwstipocambio?indCompra=${bccrIndicadorCompra}&indVenta=${bccrIndicadorVenta}&idMoneda=${idMoneda}&idCompania=${idCompania}&fechaConsulta=${fechaConsulta}`);
  }

}
