import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseMessage } from '@app/_models';
import { ScreenModule } from '@app/_models/admin/screenModule';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class PowerBIService {
  constructor(private router: Router, private http: HttpClient) {}

  getURLExterna(inScreenModulo: ScreenModule) {
    return this.http.get<ResponseMessage>(
      `${environment.apiUrl}/PowerBI/getURLExterna/${inScreenModulo.idModulo}/${inScreenModulo.idCompania}/${inScreenModulo.nombre}`
    );
  }
}
