import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Compania } from '../_models/modules/compania';
import { ArchivoCarga, HojasExcel, ResponseMessage } from '@app/_models/';

@Injectable({ providedIn: 'root' })
export class GeneralesService {
  constructor(private http: HttpClient) {}

  putCompania(compania: Compania) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/generales/updatecompania`,
      compania
    );
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

}
