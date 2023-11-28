import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseMessage } from '@app/_models';
import { ScreenModule } from '@app/_models/admin/screenModule';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class PowerBIService {
  constructor(private router: Router, private http: HttpClient) {}

  getURLExterna(inScreenModulo: ScreenModule, pIdUserSessionRequest : string = 'novalue',
                                              pUserSessionRequest : string = 'novalue',
                                              pBusinessSessionRequest : string = 'novalue',
                                              pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = {
      IdUserSessionRequest : pIdUserSessionRequest,
      UserSessionRequest : pUserSessionRequest,
      BusinessSessionRequest : pBusinessSessionRequest,
      ModuleSessionRequest : pModuleSessionRequest
    };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<ResponseMessage>(
      `${environment.apiUrl}/powerbi/geturlexterna?idModulo=${inScreenModulo.idModulo}
                                                  &idCompania=${inScreenModulo.idCompania}
                                                  &nombrePantalla=${inScreenModulo.nombre}`, httpHeaders
    );
    // return this.http.get<ResponseMessage>(
    //   `${environment.apiUrl}/PowerBI/getURLExterna/${inScreenModulo.idModulo}/${inScreenModulo.idCompania}/${inScreenModulo.nombre}`, httpHeaders
    // );
  }
}
