import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { administrator, environment } from '@environments/environment';
import { RoleBusiness, UpdateRolModel, User } from '@app/_models';
import {
  Module,
  Role,
  RolModuleBusiness,
  ResponseMessage,
  AssignRoleObject,
} from '@app/_models/';
import { Compania, CompaniaUsuario } from '@app/_models/modules/compania';
import { ScreenAccessUser } from '@app/_models/admin/screenAccessUser';
import { ScreenModule } from '@app/_models/admin/screenModule';
import { Bitacora } from '@app/_models/bitacora';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  public Oscreens: Observable<ScreenAccessUser[]>;

  private moduleSubject: BehaviorSubject<Module>;
  public moduleObservable: Observable<Module>;

  private businessSubject: BehaviorSubject<Compania>;
  public businessObservable: Observable<Compania>;

  // listas administración
  private listUsersSubject: BehaviorSubject<User[]>;
  private listRolesSubject: BehaviorSubject<Role[]>;
  private listBusinessSubject: BehaviorSubject<Compania[]>;

  // **************************************************************
  // ************************* CONSTRUCTOR ************************
  // **************************************************************
  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('user'))
    );
    this.user = this.userSubject.asObservable();

    this.businessSubject = new BehaviorSubject<Compania>(
      JSON.parse(localStorage.getItem('Obusiness'))
    );
    this.businessObservable = this.businessSubject.asObservable();

    this.moduleSubject = new BehaviorSubject<Module>(
      JSON.parse(localStorage.getItem('Omodule'))
    );
    this.moduleObservable = this.moduleSubject.asObservable();
  }

  // ******************************************************************************
  // ****************************** MÉTODOS ACCESORES *****************************
  // ******************************************************************************
  public get userListValue(): User[] {
    if (this.listUsersSubject) return this.listUsersSubject.value;
    return null;
  }
  public get rolListValue(): Role[] {
    if (this.listRolesSubject) return this.listRolesSubject.value;
    return null;
  }
  public get businessListValue(): Compania[] {
    if (this.listBusinessSubject) return this.listBusinessSubject.value;
    return null;
  }

  public get userValue(): User {
    return this.userSubject.value;
  }
  public get businessValue(): Compania {
    return this.businessSubject.value;
  }
  public get moduleValue(): Module {
    return this.moduleSubject.value;
  }
  // ******************************************************************************

  // *******************************************************************
  // ********************** MÉTODOS SUBSCRIPTORES **********************
  // *******************************************************************
  // -- >> Suscribe lista de usuario para administración
  public suscribeListUser(listaUsuarios: User[]): void {
    listaUsuarios.splice(
      listaUsuarios.findIndex(
        (m) => m.identificacion == administrator.identification
      ),
      1
    );
    this.listUsersSubject = new BehaviorSubject<User[]>(listaUsuarios);
  }
  // -- >> Actualiza lista de usuario administración
  public loadListUsers(listaUsuarios: User[]): void {
    this.listUsersSubject.next(listaUsuarios);
  }
  // -- >> Suscribe lista de roles para administración
  public suscribeListRol(listaRoles: Role[]): void {
    this.listRolesSubject = new BehaviorSubject<Role[]>(listaRoles);
  }
  // -- >> Actualiza lista de roles administración
  public loadListRol(listaRoles: Role[]): void {
    this.listRolesSubject.next(listaRoles);
  }
  // -- >> Suscribe lista de roles para administración
  public suscribeListBusiness(listaRoles: Compania[]): void {
    this.listBusinessSubject = new BehaviorSubject<Compania[]>(listaRoles);
  }
  // -- >> Actualiza lista de roles administración
  public loadListBusiness(listaCompanias: Compania[]): void {
    this.listBusinessSubject.next(listaCompanias);
  }

  // -- >> Actualiza Objeto Compañía en memoria y subcripción
  public loadBusinessAsObservable(objectBusiness: Compania) {
    localStorage.removeItem('Obusiness');
    localStorage.setItem('Obusiness', JSON.stringify(objectBusiness));
    this.businessSubject.next(objectBusiness);
  }
  // -- >> Actualiza Objeto Módulo en memoria y subcripción
  public loadModuleAsObservable(mod: Module) {
    localStorage.removeItem('Omodule');
    localStorage.setItem('Omodule', JSON.stringify(mod));
    this.moduleSubject.next(mod);
  }
  // -- >> Actualiza subscripción de Usuario en localstorage
  loadUserAsObservable(user: User) {
    localStorage.removeItem('user');
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }
  // *******************************************************************

  validateAccessUser( idUser: number, idModule: number, nombrePantalla: string, idBusiness: number, pIdUserSessionRequest : string = 'novalue',
                                                                                                    // pUserSessionRequest : string = 'novalue',
                                                                                                    pBusinessSessionRequest : string = 'novalue',
                                                                                                    pModuleSessionRequest : string = 'novalue' ) {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<ResponseMessage>(
      `${environment.apiUrl}/users/validaaccesopantalla?idUsuario=${idUser}&idModulo=${idModule}
                                                                            &nomPantalla=${nombrePantalla}
                                                                            &îdEmpresa=${idBusiness}`, httpHeaders );
  }

  // **********************************************************************************************
  // -- >> Inicio de Sesión
  login(username, password) {
    return this.http.post<User>(`${environment.apiUrl}/users/autenticar`, { username, password, })
                    .pipe(
                      map((user) => {
                        localStorage.setItem('user', JSON.stringify(user));
                        this.userSubject.next(user);

                        return user;
                    }));
  }
  // **********************************************************************************************
  // -- >> Finaliza Sesión
  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);

    localStorage.removeItem('Obusiness');
    this.businessSubject.next(null);

    localStorage.removeItem('Omodule');
    this.moduleSubject.next(null);

    this.router.navigate(['account/login']);
  }
  // **********************************************************************************************
  // **********************************************************************************************
  
  // requestTipoCambioBCCR(bccrIndicadorCompra: number, bccrIndicadorVenta: number, idMoneda: number, idCompania: number, fechaConsulta: string) {
  //   // ** header
  //   const session = {
  //     IdUserSessionRequest : this.userValue ? this.userValue.id.toString() : 'noValue',
  //     UserSessionRequest : this.userValue ? this.userValue.nombreCompleto : 'noValue',
  //     BusinessSessionRequest : this.businessValue ? this.businessValue.nombre : 'noValue',
  //     ModuleSessionRequest : this.moduleValue ? this.moduleValue.nombre : 'noValue'
  //   };
  //   const httpHeaders = { headers: new HttpHeaders(session) }
  //   // **
  //   return this.http.get<GenTipoCambio>(`${environment.apiUrl}/generales/requestwstipocambio?indCompra=${bccrIndicadorCompra}
  //                                                                                           &indVenta=${bccrIndicadorVenta}
  //                                                                                           &idMoneda=${idMoneda}
  //                                                                                           &idCompania=${idCompania}
  //                                                                                           &fechaConsulta=${fechaConsulta}`, httpHeaders);
  // }

  // **********************************************************************************************
  // -- >> Limpia valores suscritos
  clearObjectModuleObservable() {
    localStorage.removeItem('Omodule');
    this.moduleSubject.next(null);
  }
  clearObjectBusinesObservable() {
    localStorage.removeItem('Obusiness');
    this.businessSubject.next(null);
  }
  // **********************************************************************************************
  // -- >> Procedimientos Empresas
  getAllBusiness( pIdUserSessionRequest : string = 'novalue',
                  // pUserSessionRequest : string = 'novalue',
                  pBusinessSessionRequest : string = 'novalue',
                  pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
      // UserSessionRequest : pUserSessionRequest,
      BusinessSessionRequest : pBusinessSessionRequest,
      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Compania[]>(
      `${environment.apiUrl}/users/listadoempresas`, httpHeaders
    );
  }
  getBusinessActiveUser(idUsuario: number,pIdUserSessionRequest : string = 'novalue',
                                          // pUserSessionRequest : string = 'novalue',
                                          pBusinessSessionRequest : string = 'novalue',
                                          pModuleSessionRequest : string = 'novalue' ) {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
      // UserSessionRequest : pUserSessionRequest,
      BusinessSessionRequest : pBusinessSessionRequest,
      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Compania[]>(
      `${environment.apiUrl}/users/empresasusuarioactivas?idUsuario=${idUsuario}`, httpHeaders
    );
  }
  getBusinessById(idEmpresa: number,pIdUserSessionRequest : string = 'novalue',
                                    // pUserSessionRequest : string = 'novalue',
                                    pBusinessSessionRequest : string = 'novalue',
                                    pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
      // UserSessionRequest : pUserSessionRequest,
      BusinessSessionRequest : pBusinessSessionRequest,
      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Compania>(
      `${environment.apiUrl}/users/empresaid?idEmpresa=${idEmpresa}`, httpHeaders
    );
  }
  addBusiness(business: Compania, pIdUserSessionRequest : string = 'novalue',
                                  // pUserSessionRequest : string = 'novalue',
                                  pBusinessSessionRequest : string = 'novalue',
                                  pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/registrarempresa`, business, httpHeaders
    );
  }
  updateBusiness(business: Compania,pIdUserSessionRequest : string = 'novalue',
                                    // pUserSessionRequest : string = 'novalue',
                                    pBusinessSessionRequest : string = 'novalue',
                                    pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/users/actualizarempresa`, business, httpHeaders
    );
  }
  assignBusinessUser(idUser: number, idBusiness: number,pIdUserSessionRequest : string = 'novalue',
                                                        // pUserSessionRequest : string = 'novalue',
                                                        pBusinessSessionRequest : string = 'novalue',
                                                        pModuleSessionRequest : string = 'novalue') {
    let assignBusinessUObject = new CompaniaUsuario();
    assignBusinessUObject.IdUsuario = idUser;
    assignBusinessUObject.IdSociedad = idBusiness;
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
      // UserSessionRequest : pUserSessionRequest,
      BusinessSessionRequest : pBusinessSessionRequest,
      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/asignarsociedadusuario`, assignBusinessUObject, httpHeaders
    );
  }
  dessAssignBusinessUser(idUser:number,idBusiness:number, pIdUserSessionRequest : string = 'novalue',
                                                          // pUserSessionRequest : string = 'novalue',
                                                          pBusinessSessionRequest : string = 'novalue',
                                                          pModuleSessionRequest : string = 'novalue') {
    const desAssignBusinessUObject = new CompaniaUsuario();
    desAssignBusinessUObject.IdUsuario = idUser;
    desAssignBusinessUObject.IdSociedad = idBusiness;
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
      // UserSessionRequest : pUserSessionRequest,
      BusinessSessionRequest : pBusinessSessionRequest,
      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/desasignsociedadusuario`, desAssignBusinessUObject, httpHeaders
    );
  }
  dessAssignAllBusinessUser(idUser:number,pIdUserSessionRequest : string = 'novalue',
                                          // pUserSessionRequest : string = 'novalue',
                                          pBusinessSessionRequest : string = 'novalue',
                                          pModuleSessionRequest : string = 'novalue') {
    let desAssignUserBusiness = new CompaniaUsuario();
    desAssignUserBusiness.IdUsuario = idUser;
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
      // UserSessionRequest : pUserSessionRequest,
      BusinessSessionRequest : pBusinessSessionRequest,
      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/desasignallsociedades`, desAssignUserBusiness, httpHeaders
    );
  }
  // **********************************************************************************************
  postBitacora(bitacora: Bitacora,pIdUserSessionRequest : string = 'novalue',
                                  // pUserSessionRequest : string = 'novalue',
                                  pBusinessSessionRequest : string = 'novalue',
                                  pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/postbitacora`, bitacora, httpHeaders
    );
  }
  // **********************************************************************************************
  // **********************************************************************************************
  // -- >> MODULOS
  postModule(modulo: Module,pIdUserSessionRequest : string = 'novalue',
                            // pUserSessionRequest : string = 'novalue',
                            pBusinessSessionRequest : string = 'novalue',
                            pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/postmodulo`, modulo, httpHeaders
    );
  }
  deleteModule(modulo: Module,pIdUserSessionRequest : string = 'novalue',
                              // pUserSessionRequest : string = 'novalue',
                              pBusinessSessionRequest : string = 'novalue',
                              pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/users/deletemodulo/${modulo.id}`, httpHeaders
    );
  }
  updateModule(modulo: Module,pIdUserSessionRequest : string = 'novalue',
                              // pUserSessionRequest : string = 'novalue',
                              pBusinessSessionRequest : string = 'novalue',
                              pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/users/updatemodulo/${modulo.id}`, modulo, httpHeaders
    );
  }

  getModulesSystem( pIdUserSessionRequest : string = 'novalue',
                    // pUserSessionRequest : string = 'novalue',
                    pBusinessSessionRequest : string = 'novalue',
                    pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Module[]>(
      `${environment.apiUrl}/users/modulossistema`, httpHeaders
    );
  }
  getModulesBusiness(idEmpresa: number, pIdUserSessionRequest : string = 'novalue',
                                        // pUserSessionRequest : string = 'novalue',
                                        pBusinessSessionRequest : string = 'novalue',
                                        pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Module[]>(
      `${environment.apiUrl}/users/modulossociedad?idEmpresa=${idEmpresa}`, httpHeaders
    );
  }
  getModuleId(idModule: number, pIdUserSessionRequest : string = 'novalue',
                                // pUserSessionRequest : string = 'novalue',
                                pBusinessSessionRequest : string = 'novalue',
                                pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Module>(
      `${environment.apiUrl}/users/getmoduloid?idModule=${idModule}`, httpHeaders
    );
  }
  getModulesByRolAndBusiness(idRol: string, idEmpresa: number,pIdUserSessionRequest : string = 'novalue',
                                                              // pUserSessionRequest : string = 'novalue',
                                                              pBusinessSessionRequest : string = 'novalue',
                                                              pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Module[]>(
      `${environment.apiUrl}/users/modulosrolempresa?idEmpresa=${idEmpresa}&idRol=${idRol}`, httpHeaders
    );
  }
  deleteAccessModuleToRol(idRol: string, idModulo:number,idEmpresa: number, pIdUserSessionRequest : string = 'novalue',
                                                                            // pUserSessionRequest : string = 'novalue',
                                                                            pBusinessSessionRequest : string = 'novalue',
                                                                            pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/users/eliminaraccesomodulo?idRol=${idRol}&idModulo=${idModulo}&idEmpresa=${idEmpresa}`, httpHeaders
    );
  }
  grantAccessModuleToRol(idRol: string, idModulo: number,idBusiness: number,pIdUserSessionRequest : string = 'novalue',
                                                                            // pUserSessionRequest : string = 'novalue',
                                                                            pBusinessSessionRequest : string = 'novalue',
                                                                            pModuleSessionRequest : string = 'novalue') {
    let accessMod: RolModuleBusiness = new RolModuleBusiness();
    accessMod.idRol = idRol;
    accessMod.idModulo = idModulo;
    accessMod.idBusiness = idBusiness;
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/otorgaraccesoamodulo`, accessMod, httpHeaders
    );
  }
  activateModule(idModule: number, idEmpresa: number, pIdUserSessionRequest : string = 'novalue',
                                                      // pUserSessionRequest : string = 'novalue',
                                                      pBusinessSessionRequest : string = 'novalue',
                                                      pModuleSessionRequest : string = 'novalue') {
    let activateMod: RolModuleBusiness = new RolModuleBusiness();
    activateMod.idModulo = idModule;
    activateMod.idBusiness = idEmpresa;
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/users/activarmodulo`, activateMod, httpHeaders
    );
  }
  inActivateModule(idModule: number, idBusiness: number,pIdUserSessionRequest : string = 'novalue',
                                                        // pUserSessionRequest : string = 'novalue',
                                                        pBusinessSessionRequest : string = 'novalue',
                                                        pModuleSessionRequest : string = 'novalue') {
    let inActivateMod: RolModuleBusiness = new RolModuleBusiness();
    inActivateMod.idModulo = idModule;
    inActivateMod.idBusiness = idBusiness;
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/users/inactivarmodulo`, inActivateMod, httpHeaders
    );
  }
  assignModuleToBusiness(idModule: number, idBusiness: number,pIdUserSessionRequest : string = 'novalue',
                                                              // pUserSessionRequest : string = 'novalue',
                                                              pBusinessSessionRequest : string = 'novalue',
                                                              pModuleSessionRequest : string = 'novalue') {
    let moduleToBusiness: RolModuleBusiness = new RolModuleBusiness();
    moduleToBusiness.idModulo = idModule;
    moduleToBusiness.idBusiness = idBusiness;
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/asignarmodulosociedad`, moduleToBusiness, httpHeaders
    );
  }
  desAssignModuleToBusiness(moduleId: number, idEmpresa: number,pIdUserSessionRequest : string = 'novalue',
                                                                // pUserSessionRequest : string = 'novalue',
                                                                pBusinessSessionRequest : string = 'novalue',
                                                                pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/users/desasigmodsociedad?idModulo=${moduleId}&idEmpresa=${idEmpresa}`, httpHeaders
    );
  }

  // *************************
  getModulesActiveBusiness(idEmpresa: number, pIdUserSessionRequest : string = 'novalue',
                                              // pUserSessionRequest : string = 'novalue',
                                              pBusinessSessionRequest : string = 'novalue',
                                              pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest
    };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Module[]>(
      `${environment.apiUrl}/users/modulosactsociedad?idEmpresa=${idEmpresa}`, httpHeaders
    );
  }
  getModulesActiveUser(idEmpresa: number, idRol: string,pIdUserSessionRequest : string = 'novalue',
                                                        // pUserSessionRequest : string = 'novalue',
                                                        pBusinessSessionRequest : string = 'novalue',
                                                        pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Module[]>(
      `${environment.apiUrl}/users/modulosactusuario?idEmpresa=${idEmpresa}&idRol=${idRol}`, httpHeaders
    );
  }
  // addModuleRol(module: Module) {
  //   // ** header
  //   const session = {
  //     IdUserSessionRequest : this.userValue ? this.userValue.id.toString() : 'noValue',
  //     UserSessionRequest : this.userValue ? this.userValue.nombreCompleto : 'noValue',
  //     BusinessSessionRequest : this.businessValue ? this.businessValue.nombre : 'noValue',
  //     ModuleSessionRequest : this.moduleValue ? this.moduleValue.nombre : 'noValue'
  //   };
  //   const httpHeaders = { headers: new HttpHeaders(session) }
  //   // **
  //   return this.http.post<Module>(
  //     `${environment.apiUrl}/users/registrarmodulo`, module, httpHeaders
  //   );
  // }
  // **********************************************************************************************
  // **********************************************************************************************
  // MANTENIMIENTO DE PANTALLAS DE ACCEDO POR MÓDULO
  getPantallasModulo( idModulo: number, idEmpresa: number, soloActivos: boolean,pIdUserSessionRequest : string = 'novalue',
                                                                                // pUserSessionRequest : string = 'novalue',
                                                                                pBusinessSessionRequest : string = 'novalue',
                                                                                pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<ScreenModule[]>(
      `${environment.apiUrl}/users/getpantallasmoduloempresa?idModulo=${idModulo}&idEmpresa=${idEmpresa}&soloActivos=${soloActivos}`, httpHeaders
    );
  }
  getPantallasNombre( nombrePantalla: string, idEmpresa: number,soloActivos: boolean, pIdUserSessionRequest : string = 'novalue',
                                                                                      // pUserSessionRequest : string = 'novalue',
                                                                                      pBusinessSessionRequest : string = 'novalue',
                                                                                      pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<ScreenModule[]>(
      `${environment.apiUrl}/users/getpantallasnombreempresa?nombrePantalla=${nombrePantalla}&idEmpresa=${idEmpresa}&soloActivos=${soloActivos}`, httpHeaders
    );
  }
  postPantallaModulo(objeto: ScreenModule,pIdUserSessionRequest : string = 'novalue',
                                          // pUserSessionRequest : string = 'novalue',
                                          pBusinessSessionRequest : string = 'novalue',
                                          pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/createpantallamodulo`, objeto, httpHeaders
    );
  }
  deletePantallaModulo(id: number,pIdUserSessionRequest : string = 'novalue',
                                  // pUserSessionRequest : string = 'novalue',
                                  pBusinessSessionRequest : string = 'novalue',
                                  pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/users/deletepantallamodulo?id=${id}`, httpHeaders
    );
  }
  deleteAccesoPantallaUsuario( idUsuario: number, idPantalla: number,idEmpresa: number, pIdUserSessionRequest : string = 'novalue',
                                                                                        // pUserSessionRequest : string = 'novalue',
                                                                                        pBusinessSessionRequest : string = 'novalue',
                                                                                        pModuleSessionRequest : string = 'novalue' ) {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/users/deleteaccesspantallausuario?idUsuario=${idUsuario}&idPantalla=${idPantalla}&idEmpresa=${idEmpresa}`, httpHeaders
    );
  }
  putPantallaModulo(objeto: ScreenModule, pIdUserSessionRequest : string = 'novalue',
                                          // pUserSessionRequest : string = 'novalue',
                                          pBusinessSessionRequest : string = 'novalue',
                                          pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/users/updatepantallamodulo`, objeto, httpHeaders
    );
  }
  postPantallaAccesoUsuario(objeto: ScreenAccessUser, pIdUserSessionRequest : string = 'novalue',
                                                      // pUserSessionRequest : string = 'novalue',
                                                      pBusinessSessionRequest : string = 'novalue',
                                                      pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/createaccesspantallausuario`, objeto, httpHeaders
    );
  }
  // *********************************

  //#region API - USUARIOS

  activateByEmail(user: User) {
    // ** header
    const session = { IdUserSessionRequest : 'novalue',
                      UserSessionRequest : 'email', 
                      BusinessSessionRequest : 'novalue', 
                      ModuleSessionRequest : 'novalue' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<ResponseMessage>(
      `${environment.apiUrl}/users/activate?token=${user.token}&id=${user.identificacion}`, httpHeaders
    );
  }

  reenviarCorreoActivacion(username,password, pIdUserSessionRequest : string = 'novalue',
                                              // pUserSessionRequest : string = 'novalue',
                                              pBusinessSessionRequest : string = 'novalue',
                                              pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/reevniarcorreoactivacion`, { username, password, }, httpHeaders
    );
  }

  addUser(user: User, pIdUserSessionRequest : string = 'novalue',
                      // pUserSessionRequest : string = 'novalue',
                      pBusinessSessionRequest : string = 'novalue',
                      pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/registrarusuario`, user, httpHeaders
    );
  }
  removeRoleUser(user: User,pIdUserSessionRequest : string = 'novalue',
                            // pUserSessionRequest : string = 'novalue',
                            pBusinessSessionRequest : string = 'novalue',
                            pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/users/removerrolusuario`, user, httpHeaders
    );
  }
  updateUser(identificacionUpdate: string, user: User,pIdUserSessionRequest : string = 'novalue',
                                                      // pUserSessionRequest : string = 'novalue',
                                                      pBusinessSessionRequest : string = 'novalue',
                                                      pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>(
        `${environment.apiUrl}/users/actualizarusuario`, user, httpHeaders
    )
    .pipe(
      map((x) => {
        // actualiza la información del usuario local si es quien se está en la sesión
        if (identificacionUpdate === this.userValue.identificacion) {
          this.userValue.identificacion = user.identificacion;
          this.userValue.nombreCompleto = user.nombreCompleto;
          this.userValue.numeroTelefono = user.numeroTelefono;
          this.userValue.email = user.email;
          this.userValue.puesto = user.puesto;

          this.loadUserAsObservable(this.userValue);
        }
        return x;
    }) );
  }
  activateInactivateUser(user: User,pIdUserSessionRequest : string = 'novalue',
                                    // pUserSessionRequest : string = 'novalue',
                                    pBusinessSessionRequest : string = 'novalue',
                                    pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/users/activarinactivarcuenta`, user, httpHeaders
    );
  }

  getAllUsers(pIdUserSessionRequest : string = 'novalue',
              // pUserSessionRequest : string = 'novalue',
              pBusinessSessionRequest : string = 'novalue',
              pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<User[]>(`${environment.apiUrl}/users/getallusers`, httpHeaders
    );
  }
  // getUser(usuarioid: string) {
  //   // ** header
  //   const session = {
  //     IdUserSessionRequest : this.userValue ? this.userValue.id.toString() : 'noValue',
  //     UserSessionRequest : this.userValue ? this.userValue.nombreCompleto : 'noValue',
  //     BusinessSessionRequest : this.businessValue ? this.businessValue.nombre : 'noValue',
  //     ModuleSessionRequest : this.moduleValue ? this.moduleValue.nombre : 'noValue'
  //   };
  //   const httpHeaders = { headers: new HttpHeaders(session) }
  //   // **
  //   return this.http.get<User>(`${environment.apiUrl}/users/${usuarioid}`, httpHeaders);
  // }
  getUserByIdentification(identification: string, pIdUserSessionRequest : string = 'novalue',
                                                  // pUserSessionRequest : string = 'novalue',
                                                  pBusinessSessionRequest : string = 'novalue',
                                                  pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<User>(
      `${environment.apiUrl}/users/usuarioidentification?identUsuario=${identification}`, httpHeaders
    );
  }
  getUsersBusiness(idEmpresa: number, pIdUserSessionRequest : string = 'novalue',
                                      // pUserSessionRequest : string = 'novalue',
                                      pBusinessSessionRequest : string = 'novalue',
                                      pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<User[]>(
      `${environment.apiUrl}/users/usuariosempresa?idEmpresa=${idEmpresa}`, httpHeaders
    );
  }
  getUsersBusinessScreenModule( idPantalla: number, idEmpresa: number, soloActivos: boolean,pIdUserSessionRequest : string = 'novalue',
                                                                                            // pUserSessionRequest : string = 'novalue',
                                                                                            pBusinessSessionRequest : string = 'novalue',
                                                                                            pModuleSessionRequest : string = 'novalue' ) {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<User[]>(
      `${environment.apiUrl}/users/getusuariosaccesopantalla?idPantalla=${idPantalla}&idEmpresa=${idEmpresa}&soloActivos=${soloActivos}`, httpHeaders
    );
  }
  deleteUser(idUser: number, idBusiness: number,pIdUserSessionRequest : string = 'novalue',
                                                // pUserSessionRequest : string = 'novalue',
                                                pBusinessSessionRequest : string = 'novalue',
                                                pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/users/deleteuser?idUser=${idUser}&idBusiness=${idBusiness}`, httpHeaders
    )
    .pipe(map((x) => {
        // -- >> si se elimina el usuario de la sesión se cierra sesión
        if (idUser === this.userValue.id) this.logout();

        return x;
    }));
  }

  //#endregion

  // ***************************************************************
  // PROCS . ROLES
  getRolUserBusiness(idRol: string, idBusiness: number, pIdUserSessionRequest : string = 'novalue',
                                                        // pUserSessionRequest : string = 'novalue',
                                                        pBusinessSessionRequest : string = 'novalue',
                                                        pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Role>(
      `${environment.apiUrl}/users/getroluserbusiness?idRol=${idRol}&idBusiness=${idBusiness}`, httpHeaders
    );
  }
  getRolesBusiness(idBusiness: number,pIdUserSessionRequest : string = 'novalue',
                                      // pUserSessionRequest : string = 'novalue',
                                      pBusinessSessionRequest : string = 'novalue',
                                      pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Role[]>(
      `${environment.apiUrl}/users/getrolesbusiness?idBusiness=${idBusiness}`, httpHeaders
    );
  }
  assignRoleUser(idRole: string, idUser: string,pIdUserSessionRequest : string = 'novalue',
                                                // pUserSessionRequest : string = 'novalue',
                                                pBusinessSessionRequest : string = 'novalue',
                                                pModuleSessionRequest : string = 'novalue') {
    let assignRolObject: AssignRoleObject = new AssignRoleObject();
    assignRolObject.idRole = idRole;
    assignRolObject.idUser = idUser;
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/asignarrolusuario`, assignRolObject, httpHeaders
    );
  }
  updateRol(rol: Role, idBusiness:number, pIdUserSessionRequest : string = 'novalue',
                                          // pUserSessionRequest : string = 'novalue',
                                          pBusinessSessionRequest : string = 'novalue',
                                          pModuleSessionRequest : string = 'novalue') {
    let assignRolObject: UpdateRolModel = new UpdateRolModel();
    assignRolObject.idRol = rol.id;
    assignRolObject.idBusiness = idBusiness;
    assignRolObject.estado = rol.estado;
    assignRolObject.tipo = rol.tipo;
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/users/actualizarrol`, assignRolObject, httpHeaders
    );
  }
  addRol(role: Role,pIdUserSessionRequest : string = 'novalue',
                    // pUserSessionRequest : string = 'novalue',
                    pBusinessSessionRequest : string = 'novalue',
                    pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/registrarrol`, role, httpHeaders
    );
  }
  assignRolBusiness(roleBusiness:RoleBusiness,pIdUserSessionRequest : string = 'novalue',
                                              // pUserSessionRequest : string = 'novalue',
                                              pBusinessSessionRequest : string = 'novalue',
                                              pModuleSessionRequest : string = 'novalue') {
    // ** header
    const session = { IdUserSessionRequest : pIdUserSessionRequest,
                      // UserSessionRequest : pUserSessionRequest,
                      BusinessSessionRequest : pBusinessSessionRequest,
                      ModuleSessionRequest : pModuleSessionRequest };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/registrarrolcompania`, roleBusiness, httpHeaders
    );
  }
  // ***************************************************************
}