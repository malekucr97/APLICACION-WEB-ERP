import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ResponseMessage } from '@app/_models/';
import { RiesgoCreditoProcesamientoCarga } from '@app/_models/RiesgoCredito/Index';

@Injectable({ providedIn: 'root' })
export class RiesgoCreditoService {

  constructor(private http: HttpClient) {}

  postProcesarCarga(body: RiesgoCreditoProcesamientoCarga) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/RiesgoCredito/PostProcesarCarga`,
      body
    );
  }

}
