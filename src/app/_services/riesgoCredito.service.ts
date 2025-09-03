import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Compania, Module, ResponseMessage, User } from '@app/_models/';
import { RiesgoCreditoProcesamientoCarga } from '@app/_models/RiesgoCredito/Index';
import { AccountService } from './account.service';
import { Entidad } from '@app/_models/RiesgoCredito/entidad';
import { Categoria } from '@app/_models/RiesgoCredito/categoria';
import { Rango } from '@app/_models/RiesgoCredito/rango';

@Injectable({ providedIn: 'root' })
export class RiesgoCreditoService {

  private _user: User;
  private _module: Module;
  private _business: Compania;

  public get userValue(): User { return this._user; }
  public get businessValue(): Compania { return this._business; }
  public get moduleValue(): Module { return this._module; }

  private _headers : HttpHeaders;
  public get headersValue(): HttpHeaders { return this._headers; }

  constructor(private http: HttpClient,
              private userService: AccountService
  ) {

    this._user = this.userService.userValue;
    this._business = this.userService.businessValue;
    this._module = this.userService.moduleValue;

    this._headers = this.creaObjetoHttpHeader();
  }

  // **********************************************************************************************
  // 2025 ** ACTS SEGURIDAD ******
  // **********************************************************************************************
  creaObjetoHttpHeader() : HttpHeaders {
    let idUsuario = this.userValue.id.toString();
    let idBusiness = this.businessValue.id.toString();
    let idModule = this.moduleValue.id.toString();
    const httpHeaders = new HttpHeaders({'Content-Type':'application/json', '_idsession':idUsuario,
                                                                            '_business':idBusiness,
                                                                            '_module':idModule});
    return httpHeaders;
  }
  // **********************************************************************************************

  GET_ENTIDAD() {
    return this.http.get<Entidad[]>(
      `${environment.apiUrl}/riesgocredito/getentidad?pidBusiness=${this.businessValue.id}&pidModule=${this.moduleValue.id}`,
      { headers: this.headersValue } );
  }
  POST_ENTIDAD(pobj: Entidad) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/riesgocredito/postentidad`, pobj, { headers: this.headersValue });
  }
  PUT_ENTIDAD(pobj: Entidad) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/riesgocredito/putentidad`, pobj, { headers: this.headersValue });
  }
  DELETE_ENTIDAD(pobj: Entidad) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/riesgocredito/deleteentidad?pid=${pobj.id}&pidBusiness=${pobj.idCompania}&pidModule=${pobj.idModulo}`, 
      { headers: this.headersValue });
  }

  GET_CATEGORIA() {
    return this.http.get<Categoria[]>(
      `${environment.apiUrl}/riesgocredito/getcategoria?pidBusiness=${this.businessValue.id}&pidModule=${this.moduleValue.id}`,
      { headers: this.headersValue } );
  }
  POST_CATEGORIA(pobj: Categoria) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/riesgocredito/postcategoria`, pobj, { headers: this.headersValue });
  }
  PUT_CATEGORIA(pobj: Categoria) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/riesgocredito/putcategoria`, pobj, { headers: this.headersValue });
  }
  DELETE_CATEGORIA(pobj: Categoria) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/riesgocredito/deletecategoria?id=${pobj.id}&idBusiness=${pobj.idCompania}&idModule=${pobj.idModulo}`, 
      { headers: this.headersValue });
  }

  // ** RANGOS

  POST_RANGO(pobj: Rango) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/riesgocredito/postrango`, pobj, { headers: this.headersValue });
  }
  PUT_RANGO(pobj: Rango) {
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/riesgocredito/putrango`, pobj, { headers: this.headersValue });
  }
  DELETE_RANGO(pobj: Rango) {
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/riesgocredito/deleterango?id=${pobj.id}&idBusiness=${pobj.idCompania}&idModule=${pobj.idModulo}`, 
      { headers: this.headersValue });
  }

  GET_IDENTIFICADORES_RANGOS() {
    return this.http.get<Rango[]>(
      `${environment.apiUrl}/riesgocredito/getidentificadoresrango?pidBusiness=${this.businessValue.id}&pidModule=${this.moduleValue.id}`,
      { headers: this.headersValue } );
  }

  GET_RANGOS_IDENTIFICADOR(pidentificador: string) {
    return this.http.get<Rango[]>(
      `${environment.apiUrl}/riesgocredito/getrangoidentificador?pidBusiness=${this.businessValue.id}&pidModule=${this.moduleValue.id}&pidentificador=${pidentificador}`,
      { headers: this.headersValue } );
  }




  postProcesarCarga(body: RiesgoCreditoProcesamientoCarga) {
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/RiesgoCredito/PostProcesarCarga`,
      body
    );
  }
}
