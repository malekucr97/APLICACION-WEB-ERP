import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseMessage } from '@app/_models';
import { ScreenModule } from '@app/_models/admin/screenModule';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class PowerBIService {
  constructor(private router: Router, private http: HttpClient) {}

  getURLExterna(imod: ScreenModule, pidsession : string = '', pbusiness : string = '', pmod : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : pmod };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    // return this.http.get<ResponseMessage>(
    //   `${environment.apiUrl}/PowerBI/getURLExterna/${inScreenModulo.idModulo}/${inScreenModulo.idCompania}/${inScreenModulo.nombre}`
    // );
    return this.http.get<ResponseMessage>(
      `${environment.apiUrl}/powerbi/geturlexterna?idModulo=${imod.idModulo}&idCompania=${imod.idCompania}&nombrePantalla=${imod.nombre}`,
        httpHeaders
    );
  }
}
