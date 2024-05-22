import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { administrator, environment } from '@environments/environment';
import { RoleBusiness, UpdateRolModel, User } from '@app/_models';
import { Module, Role, RolModuleBusiness, ResponseMessage, AssignRoleObject } from '@app/_models/';
import { Compania, CompaniaUsuario } from '@app/_models/modules/compania';
import { ScreenAccessUser } from '@app/_models/admin/screenAccessUser';
import { ScreenModule } from '@app/_models/admin/screenModule';
import { Bitacora } from '@app/_models/bitacora';
import { AdminPlan } from '@app/_models/admin/planes/plan';
import { AdminPlanXBusiness } from '@app/_models/admin/planes/planxBusiness';

@Injectable({ providedIn: 'root' })
export class AccountService {

  //#region "DEFINICION DE VARIABLES"
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
  //#endregion "DEFINICION DE VARIABLES"

  //#region "CONSTRUCTOR"
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
  //#endregion "CONSTRUCTOR"

  //#region "MÉTODOS ACCESORES"
  // ******************************************************************************
  // ****************************** MÉTODOS ACCESORES *****************************
  // ******************************************************************************
  public get userListValue(): User[] {
    if (this.listUsersSubject) return this.listUsersSubject.value; return null;
  }
  public get rolListValue(): Role[] {
    if (this.listRolesSubject) return this.listRolesSubject.value; return null;
  }
  public get businessListValue(): Compania[] {
    if (this.listBusinessSubject) return this.listBusinessSubject.value; return null;
  }

  public get userValue(): User { return this.userSubject.value; }
  public get businessValue(): Compania { return this.businessSubject.value; }
  public get moduleValue(): Module { return this.moduleSubject.value; }
  // ******************************************************************************
  //#endregion "MÉTODOS ACCESORES"

  //#region "MÉTODOS SUBSCRIPTORES"
  // *******************************************************************
  // ********************** MÉTODOS SUBSCRIPTORES **********************
  // *******************************************************************
  // -- >> Suscribe lista de usuario para administración
  public suscribeListUser(listaUsuarios: User[]): void {
    listaUsuarios.splice(
      listaUsuarios.findIndex( (m) => m.identificacion == administrator.identification ), 1
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
  public suscribeListBusiness(listaBusiness: Compania[]): void {
    this.listBusinessSubject = new BehaviorSubject<Compania[]>(listaBusiness);
  }
  // -- >> Actualiza lista de compañías administración
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
  //#endregion "MÉTODOS SUBSCRIPTORES"

  validateAccessUser( idUser: number, idModule: number, nombrePantalla: string, idBusiness: number, pidsession : string = '',
                                                                                                    pbusiness : string = '',
                                                                                                    pmod : string = '' ) {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : pmod };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<ResponseMessage>(
      `${environment.apiUrl}/users/validaaccesopantalla?idUsuario=${idUser}&idModulo=${idModule}
                                                                            &nomPantalla=${nombrePantalla}
                                                                            &îdEmpresa=${idBusiness}`, httpHeaders );
  }

  //#region "finaliza sesión"
  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);

    localStorage.removeItem('Obusiness');
    this.businessSubject.next(null);

    localStorage.removeItem('Omodule');
    this.moduleSubject.next(null);

    this.router.navigate(['account/login']);
  }
  //#endregion "finaliza sesión"
  //#region "limpia sesión"
  clearObjectModuleObservable() { localStorage.removeItem('Omodule'); this.moduleSubject.next(null); }
  clearObjectBusinesObservable() { localStorage.removeItem('Obusiness'); this.businessSubject.next(null); }
  //#endregion "limpia sesión"

  // **********************************************************************************************
  // -- >> Inicio de Sesión
  login(username, password) {
    return this.http.post<User>(`${environment.apiUrl}/users/autenticar`, { username, password })
      .pipe(
        map((user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
      }));
  }
  // **********************************************************************************************
  
  // **********************************************************************************************
  // -- >> Procedimientos Empresas
  getAllBusiness( pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Compania[]>(
      `${environment.apiUrl}/users/listadoempresas`,
        httpHeaders
    );
  }
  getBusinessActiveUser(idUsuario: number,pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Compania[]>(
      `${environment.apiUrl}/users/empresasusuarioactivas?idUsuario=${idUsuario}`, 
        httpHeaders
    );
  }
  getBusinessById(idEmpresa: number,pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Compania>(
      `${environment.apiUrl}/users/empresaid?idEmpresa=${idEmpresa}`, 
        httpHeaders
    );
  }
  addBusiness(business: Compania, pidsession : string = '', pbusiness : string = '', pmod : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : pmod };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/registrarempresa`, business, httpHeaders
    );
  }
  updateBusiness(business: Compania,pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/users/actualizarempresa`, 
        business, 
        httpHeaders
    );
  }
  assignBusinessUser(idUser: number, idBusiness: number,pidsession : string = '', pbusiness : string = '') {
    const assignBusinessUObject = new CompaniaUsuario();
    assignBusinessUObject.IdUsuario = idUser;
    assignBusinessUObject.IdSociedad = idBusiness;
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/asignarsociedadusuario`, 
        assignBusinessUObject, 
        httpHeaders
    );
  }
  dessAssignBusinessUser(idUser:number,idBusiness:number, pidsession : string = '',pbusiness : string = '') {
    const desAssignBusinessUObject = new CompaniaUsuario();
    desAssignBusinessUObject.IdUsuario = idUser;
    desAssignBusinessUObject.IdSociedad = idBusiness;
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/desasignsociedadusuario`, 
        desAssignBusinessUObject, 
        httpHeaders
    );
  }
  dessAssignAllBusinessUser(idUser:number,pidsession : string = '', pbusiness : string = '', pmod : string = '') {
    const desAssignUserBusiness = new CompaniaUsuario();
    desAssignUserBusiness.IdUsuario = idUser;
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/desasignallsociedades`, 
        desAssignUserBusiness, 
        httpHeaders
    );
  }
  // **********************************************************************************************
  postBitacora(bitacora: Bitacora,pidsession : string = '') {
    // ** header
    const session = { _idsession : pidsession, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/postbitacora`, 
        bitacora, 
        httpHeaders
    );
  }
  // **********************************************************************************************
  // **********************************************************************************************
  // -- >> MODULOS
  getModulesActiveBusiness(idEmpresa: number, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) };
    // **
    return this.http.get<Module[]>(
      `${environment.apiUrl}/users/modulosactsociedad?idEmpresa=${idEmpresa}`,
      httpHeaders 
    );
  }
  getModulesSystem( pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Module[]>( 
      `${environment.apiUrl}/users/modulossistema`, 
        httpHeaders 
    );
  }
  getModulesBusiness(idEmpresa: number, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Module[]>(
      `${environment.apiUrl}/users/modulossociedad?idEmpresa=${idEmpresa}`, 
        httpHeaders
    );
  }
  activateModule(idModule: number, idEmpresa: number, pidsession : string = '', pbusiness : string = '') {
    const activateMod: RolModuleBusiness = new RolModuleBusiness();
    activateMod.idModulo = idModule;
    activateMod.idBusiness = idEmpresa;
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/users/activarmodulo`, 
        activateMod, 
        httpHeaders
    );
  }
  inActivateModule( idModule: number, idBusiness: number, pidsession : string = '', pbusiness : string = '') {
    const inActivateMod: RolModuleBusiness = new RolModuleBusiness();
    inActivateMod.idModulo = idModule;
    inActivateMod.idBusiness = idBusiness;
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/users/inactivarmodulo`, 
        inActivateMod, 
        httpHeaders
    );
  }
  postModule(modulo: Module,pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/postmodulo`, 
        modulo, 
        httpHeaders
    );
  }
  deleteModule(modulo: Module,pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/users/deletemodulo/${modulo.id}`, 
        httpHeaders
    );
  }
  updateModule(modulo: Module,pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/users/updatemodulo/${modulo.id}`, 
        modulo, 
        httpHeaders
    );
  }
  getModuleId(idModule: number, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Module>(
      `${environment.apiUrl}/users/getmoduloid?idModule=${idModule}`, 
        httpHeaders
    );
  }
  getModulesByRolAndBusiness(idRol: string, idEmpresa: number,pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Module[]>(
      `${environment.apiUrl}/users/modulosrolempresa?idEmpresa=${idEmpresa}&idRol=${idRol}`, 
        httpHeaders
    );
  }
  deleteAccessModuleToRol(idRol: string, idModulo:number,idEmpresa: number, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/users/eliminaraccesomodulo?idRol=${idRol}&idModulo=${idModulo}&idEmpresa=${idEmpresa}`, 
        httpHeaders
    );
  }
  grantAccessModuleToRol(idRol: string, idModulo: number,idBusiness: number,pidsession : string = '', pbusiness : string = '') {
    const accessMod: RolModuleBusiness = new RolModuleBusiness();
    accessMod.idRol = idRol;
    accessMod.idModulo = idModulo;
    accessMod.idBusiness = idBusiness;
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/otorgaraccesoamodulo`, 
        accessMod, 
        httpHeaders
    );
  }
  assignModuleToBusiness(idModule: number, idBusiness: number,pidsession : string = '', pbusiness : string = '') {
    let moduleToBusiness: RolModuleBusiness = new RolModuleBusiness();
    moduleToBusiness.idModulo = idModule;
    moduleToBusiness.idBusiness = idBusiness;
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/asignarmodulosociedad`, 
        moduleToBusiness, 
        httpHeaders
    );
  }
  desAssignModuleToBusiness(moduleId: number, idEmpresa: number,pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/users/desasigmodsociedad?idModulo=${moduleId}&idEmpresa=${idEmpresa}`, 
        httpHeaders
    );
  }
  // *************************
  getModulesActiveUser(idEmpresa: number, idRol: string,pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Module[]>(
      `${environment.apiUrl}/users/modulosactusuario?idEmpresa=${idEmpresa}&idRol=${idRol}`, 
        httpHeaders
    );
  }
  // **********************************************************************************************
  // **********************************************************************************************
  // MANTENIMIENTO DE PANTALLAS DE ACCEDO POR MÓDULO
  getPantallasModulo( idModulo: number, idEmpresa: number, soloActivos: boolean,pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<ScreenModule[]>(
      `${environment.apiUrl}/users/getpantallasmoduloempresa?idModulo=${idModulo}&idEmpresa=${idEmpresa}&soloActivos=${soloActivos}`, 
        httpHeaders
    );
  }
  getPantallasNombre( nombrePantalla: string, idEmpresa: number,soloActivos: boolean, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<ScreenModule[]>(
      `${environment.apiUrl}/users/getpantallasnombreempresa?nombrePantalla=${nombrePantalla}&idEmpresa=${idEmpresa}&soloActivos=${soloActivos}`, 
        httpHeaders
    );
  }
  postPantallaModulo(objeto: ScreenModule, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/createpantallamodulo`, 
        objeto, 
        httpHeaders
    );
  }
  deletePantallaModulo(id: number,pidsession : string = '', pbusiness : string = '', pmod : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : pmod };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/users/deletepantallamodulo?id=${id}`, httpHeaders
    );
  }
  deleteAccesoPantallaUsuario( idUsuario: number, idPantalla: number,idEmpresa: number, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/users/deleteaccesspantallausuario?idUsuario=${idUsuario}&idPantalla=${idPantalla}&idEmpresa=${idEmpresa}`,
        httpHeaders
    );
  }
  putPantallaModulo(objeto: ScreenModule, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/users/updatepantallamodulo`, 
        objeto, 
        httpHeaders
    );
  }
  postPantallaAccesoUsuario(objeto: ScreenAccessUser, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/createaccesspantallausuario`, 
        objeto, 
        httpHeaders
    );
  }
  // *********************************

  //#region API - USUARIOS

  activateByEmail(user: User) {
    // ** header
    const session = { _idsession : '', UserSessionRequest : 'email',  _business : '',  _module : '' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<ResponseMessage>(
      `${environment.apiUrl}/users/activate?token=${user.token}&id=${user.identificacion}`, httpHeaders
    );
  }

  reenviarCorreoActivacion(username,password, pidsession : string = '', pbusiness : string = '', pmod : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : pmod };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/reevniarcorreoactivacion`, { username, password, }, httpHeaders
    );
  }

  addUser(user: User, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>( `${environment.apiUrl}/users/registrarusuario`, user, httpHeaders );
  }
  removeRoleUser(user: User, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/users/removerrolusuario`, 
        user, 
        httpHeaders
    );
  }
  updateUser(user: User, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>( `${environment.apiUrl}/users/actualizarusuario`, user, httpHeaders );
  }
  activateInactivateUser(user: User, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>( `${environment.apiUrl}/users/activarinactivarcuenta`, user,  httpHeaders );
  }

  getAllUsers(pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<User[]>(
      `${environment.apiUrl}/users/getallusers`,
      httpHeaders
    );
  }
  getUserByIdentification(identification: string, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<User>(
      `${environment.apiUrl}/users/usuarioidentification?identUsuario=${identification}`,
      httpHeaders
    ); 
  }
  getUsersBusiness(idEmpresa: number, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<User[]>( `${environment.apiUrl}/users/usuariosempresa?idEmpresa=${idEmpresa}`, httpHeaders );
  }
  getUsersBusinessScreenModule( idPantalla: number, idEmpresa: number, soloActivos: boolean,pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<User[]>( 
      `${environment.apiUrl}/users/getusuariosaccesopantalla?idPantalla=${idPantalla}&idEmpresa=${idEmpresa}&soloActivos=${soloActivos}`, httpHeaders );
  }
  deleteUser(idUser: number, idBusiness: number,pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.delete<ResponseMessage>( 
      `${environment.apiUrl}/users/deleteuser?idUser=${idUser}&idBusiness=${idBusiness}`, httpHeaders
    ).pipe(
        map((x) => { if (idUser === this.userValue.id) { this.logout(); } return x; }));
  }

  //#endregion

  // ***************************************************************
  // PROCS . ROLES
  getRolUserBusiness(idRol: string, idBusiness: number, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : "admin" };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Role>( `${environment.apiUrl}/users/getroluserbusiness?idRol=${idRol}&idBusiness=${idBusiness}`, httpHeaders );
  }
  getRolesBusiness(idBusiness: number, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<Role[]>( `${environment.apiUrl}/users/getrolesbusiness?idBusiness=${idBusiness}`, httpHeaders );
  }
  assignRoleUser(idRole: string, idUser: string,pidsession : string = '', pbusiness : string = '') {
    let assignRolObject: AssignRoleObject = new AssignRoleObject();
    assignRolObject.idRole = idRole;
    assignRolObject.idUser = idUser;
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>( `${environment.apiUrl}/users/asignarrolusuario`, assignRolObject, httpHeaders );
  }
  updateRol(rol: Role, idBusiness:number, pidsession : string = '', pbusiness : string = '') {
    const assignRolObject: UpdateRolModel = new UpdateRolModel();
    assignRolObject.idRol = rol.id;
    assignRolObject.idBusiness = idBusiness;
    assignRolObject.estado = rol.estado;
    assignRolObject.tipo = rol.tipo;
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>( `${environment.apiUrl}/users/actualizarrol`, assignRolObject, httpHeaders );
  }
  addRol(role: Role,pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>( `${environment.apiUrl}/users/registrarrol`, role, httpHeaders );
  }
  assignRolBusiness(roleBusiness:RoleBusiness, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>( `${environment.apiUrl}/users/registrarrolcompania`, roleBusiness, httpHeaders );
  }
  // ***************************************************************

  // -->> procedimientos planes
  addPlan(plan: AdminPlan, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/createplan`, plan, httpHeaders
    );
  }
  getAllPlanes( pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<AdminPlan[]>(
      `${environment.apiUrl}/users/listplanes`, httpHeaders
    );
  }
  getPlanById(id: number, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<AdminPlan>(
      `${environment.apiUrl}/users/getplanid?idPlan=${id}`,httpHeaders
    );
  }
  updatePlan(planUpdate: AdminPlan, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.put<ResponseMessage>(
      `${environment.apiUrl}/users/updateplan`, planUpdate, httpHeaders
    );
  }
  deletePlan(idPlan: number,pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/users/deleteplan?id=${idPlan}`, httpHeaders
    );
  }
  getPlanBusiness(idBusiness: number, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.get<AdminPlan>(
      `${environment.apiUrl}/users/getplanbusiness?idBusiness=${idBusiness}`, httpHeaders);
  }
  addPlanBusiness(planBusiness: AdminPlanXBusiness, pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.post<ResponseMessage>(
      `${environment.apiUrl}/users/createplanbusiness`, planBusiness, httpHeaders
    );
  }
  removePlanBusiness(idPlan: number,idBusiness: number,pidsession : string = '', pbusiness : string = '') {
    // ** header
    const session = { _idsession : pidsession, _business : pbusiness, _module : 'admin' };
    const httpHeaders = { headers: new HttpHeaders(session) }
    // **
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/users/removeplanbusiness?idPlan=${idPlan}&idBusiness=${idBusiness}`, httpHeaders
    );
  }
  // -->>
}