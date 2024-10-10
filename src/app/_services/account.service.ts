import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { administrator, environment } from '@environments/environment';
import { RoleBusiness, User } from '@app/_models';
import { Module, Role, ResponseMessage } from '@app/_models/';
import { Compania } from '@app/_models/modules/compania';
import { ScreenAccessUser } from '@app/_models/admin/screenAccessUser';
import { ScreenModule } from '@app/_models/admin/screenModule';
import { Bitacora } from '@app/_models/bitacora';
import { AdminPlan } from '@app/_models/admin/planes/plan';
import { AdminPlanXBusiness } from '@app/_models/admin/planes/planxBusiness';

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
    this.userSubject = new BehaviorSubject<User>( JSON.parse(localStorage.getItem('user')) );
    this.user = this.userSubject.asObservable();

    this.businessSubject = new BehaviorSubject<Compania>( JSON.parse(localStorage.getItem('Obusiness')) );
    this.businessObservable = this.businessSubject.asObservable();

    this.moduleSubject = new BehaviorSubject<Module>( JSON.parse(localStorage.getItem('Omodule')) );
    this.moduleObservable = this.moduleSubject.asObservable();
  }

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

  // *******************************************************************
  // ********************** MÉTODOS SUBSCRIPTORES **********************
  // *******************************************************************
  // -- >> Suscribe lista de usuario para administración
  public suscribeListUser(listaUsuarios: User[]): void {
    listaUsuarios.splice( listaUsuarios.findIndex( (m) => m.identificacion == administrator.identification ), 1);
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

  clearObjectModuleObservable() { localStorage.removeItem('Omodule'); this.moduleSubject.next(null); }
  clearObjectBusinesObservable() { localStorage.removeItem('Obusiness'); this.businessSubject.next(null); }

  activateByEmail(user: User) {
    return this.http.get<ResponseMessage>(`${environment.apiUrl}/users/activate?token=${user.token}&id=${user.identificacion}`);
  }
  reenviarCorreoActivacion(username) {
    return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/reevniarcorreoactivacion?username=${username}`, {});
  }
  validateAccessUser( idUser: number, idModule: number, nombrePantalla: string, idBusiness: number, pidsession : string = '',
                                                                                                    pbusiness : string = '',
                                                                                                    pmod : string = '' ) {
    const headers = new HttpHeaders({ 
      'Content-Type':'application/json','_idsession':pidsession,'_business':pbusiness,'_module':pmod
    });
    return this.http.get<ResponseMessage>( `${environment.apiUrl}/users/validaaccesopantalla?idUsuario=${idUser}
                                                                                            &idModulo=${idModule}
                                                                                            &nomPantalla=${nombrePantalla}
                                                                                            &idEmpresa=${idBusiness}`, { headers } );
  }
  postBitacora(bitacora: Bitacora,pidsession : string = '') {
    const headers = new HttpHeaders({ 
      'Content-Type':'application/json','_idsession':pidsession, '_module':'admin'
    });
    return this.http.post<ResponseMessage>( `${environment.apiUrl}/users/postbitacora`, bitacora, { headers });
  }

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
  logout() {
    localStorage.removeItem('user'); this.userSubject.next(null);
    localStorage.removeItem('Obusiness'); this.businessSubject.next(null);
    localStorage.removeItem('Omodule'); this.moduleSubject.next(null);
    this.router.navigate(['account/login']);
  }
  // **********************************************************************************************
  // 2024 ** ACTS SEGURIDAD ******
  // **********************************************************************************************
  creaObjetoHttpHeader() : HttpHeaders {
    let idUsuario = this.userValue.id.toString();
    let idBusiness = this.businessValue?.id?.toString() ?? 'select';
    let idModule = this.moduleValue?.id?.toString() ?? 'admin';
    const headers = new HttpHeaders({'Content-Type':'application/json', '_idsession':idUsuario,
                                                                        '_business':idBusiness,
                                                                        '_module':idModule});
    return headers;
  }
  // **********************************************************************************************
  // -- >> Procedimientos Empresas
  getAllBusiness() {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<Compania[]>( `${environment.apiUrl}/users/listadoempresas`, 
      { headers });
  }
  getBusinessActiveUser(idUsuario: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<Compania[]>( `${environment.apiUrl}/users/empresasusuarioactivas?idUsuario=${idUsuario}`, 
      { headers });
  }
  getBusinessById(idEmpresa: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<Compania>( `${environment.apiUrl}/users/empresaid?idEmpresa=${idEmpresa}`, 
      { headers });
  }
  addBusiness(business: Compania) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.post<ResponseMessage>( `${environment.apiUrl}/users/registrarempresa`, business, 
      { headers });
  }
  updateBusiness(business: Compania) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.put<ResponseMessage>( `${environment.apiUrl}/users/actualizarempresa`, business, 
      { headers });
  }
  assignBusinessUser(idUser: number, idBusiness: number) {
    let busonessObject = { IdUsuario : idUser, IdSociedad : idBusiness };
    const headers = this.creaObjetoHttpHeader();
    return this.http.post<ResponseMessage>( `${environment.apiUrl}/users/asignarsociedadusuario`, busonessObject, 
      { headers });
  }
  dessAssignBusinessUser(idUser:number,idBusiness:number) {
    let busonessObject = { IdUsuario : idUser, IdSociedad : idBusiness };
    const headers = this.creaObjetoHttpHeader();
    return this.http.post<ResponseMessage>( `${environment.apiUrl}/users/desasignsociedadusuario`, busonessObject, 
      { headers });
  }
  dessAssignAllBusinessUser(idUser : number) {
    let userObject = { IdUsuario : idUser };
    const headers = this.creaObjetoHttpHeader();
    return this.http.post<ResponseMessage>( `${environment.apiUrl}/users/desasignallsociedades`, userObject, 
      { headers });
  }
  // **********************************************************************************************
  // -- >> Procedimientos Módulos
  getModulesActiveBusiness(idEmpresa: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<Module[]>( `${environment.apiUrl}/users/modulosactsociedad?idEmpresa=${idEmpresa}`, 
      { headers });
  }
  getModulesSystem() {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<Module[]>(`${environment.apiUrl}/users/modulossistema`, { headers });
  }
  getModulesBusiness(idEmpresa: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<Module[]>(`${environment.apiUrl}/users/modulossociedad?idEmpresa=${idEmpresa}`, 
      { headers });
  }
  activateModule(idModule: number, idEmpresa: number) {
    let activateMod = { IdModulo : idModule, IdBusiness : idEmpresa };
    const headers = this.creaObjetoHttpHeader();
    return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/activarmodulo`, activateMod, 
      { headers });
  }
  inActivateModule( idModule: number, idBusiness: number) {
    let inActivateMod = { IdModulo : idModule, IdBusiness : idBusiness };
    const headers = this.creaObjetoHttpHeader();
    return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/inactivarmodulo`, inActivateMod, 
      { headers });
  }
  postModule(modulo: Module) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/postmodulo`, modulo, 
      { headers });
  }
  assignModuleToBusiness(idModule: number, idBusiness: number) {
    let moduleToBusiness = { IdModulo : idModule, IdBusiness : idBusiness };
    const headers = this.creaObjetoHttpHeader();
    return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/asignarmodulosociedad`, moduleToBusiness, 
      { headers });
  }
  deleteModule(modulo: Module) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.delete<ResponseMessage>(`${environment.apiUrl}/users/deletemodulo?idModulo=${modulo.id}`, 
      { headers });
  }
  updateModule(modulo: Module) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/updatemodulo?idModulo=${modulo.id}`, modulo, 
      { headers });
  }
  getModuleId(idModule: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<Module>(`${environment.apiUrl}/users/getmoduloid?idModule=${idModule}`, 
      { headers });
  }
  getModulesByRolAndBusiness(idRol: string, idEmpresa: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<Module[]>(`${environment.apiUrl}/users/modulosrolempresa?idEmpresa=${idEmpresa}&idRol=${idRol}`, 
      { headers });
  }
  grantAccessModuleToRol(idRol: string, idModulo: number,idBusiness: number) {
    let accessMod = { IdRol : idRol, IdModulo : idModulo, IdBusiness : idBusiness };
    const headers = this.creaObjetoHttpHeader();
    return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/otorgaraccesoamodulo`, accessMod, 
      { headers });
  }
  deleteAccessModuleToRol(idRol: string, idModulo:number,idEmpresa: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.delete<ResponseMessage>(`${environment.apiUrl}/users/eliminaraccesomodulo?idRol=${idRol}&idModulo=${idModulo}&idEmpresa=${idEmpresa}`, 
      { headers });
  }
  desAssignModuleToBusiness(moduleId: number, idEmpresa: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.delete<ResponseMessage>(`${environment.apiUrl}/users/desasigmodsociedad?idModulo=${moduleId}&idEmpresa=${idEmpresa}`, 
      { headers });
  }
  getModulesActiveUser(idEmpresa: number, idRol: string) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<Module[]>(`${environment.apiUrl}/users/modulosactusuario?idEmpresa=${idEmpresa}&idRol=${idRol}`, 
      { headers });
  }
  // **********************************************************************************************
  // -- >> Procedimientos Roles
  addRol(role: Role) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.post<ResponseMessage>( `${environment.apiUrl}/users/registrarrol`, role, 
      { headers });
  }
  getRolById(idRol: string) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<Role>(`${environment.apiUrl}/users/getrolid?idRol=${idRol}`, 
      { headers });
  }
  getRolUserBusiness(idRol: string, idBusiness: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<Role>( `${environment.apiUrl}/users/getroluserbusiness?idRol=${idRol}&idBusiness=${idBusiness}`, 
      { headers });
  }
  getRolesBusiness(idBusiness: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<Role[]>( `${environment.apiUrl}/users/getrolesbusiness?idBusiness=${idBusiness}`, 
      { headers });
  }
  assignRolBusiness(roleBusiness:RoleBusiness) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.post<ResponseMessage>( `${environment.apiUrl}/users/registrarrolcompania`, roleBusiness, 
      { headers });
  }
  assignRoleUser(idRole: string, idUser: string) {
    let assignRolObject = { IdRole : idRole, IdUser : idUser };
    const headers = this.creaObjetoHttpHeader();
    return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/asignarrolusuario`, assignRolObject, 
      { headers });
  }
  updateRol(rol: Role, idBusiness:number) {
    let assignRolObject = { IdRol : rol.id, IdBusiness : idBusiness, Estado : rol.estado, Tipo : rol.tipo };
    const headers = this.creaObjetoHttpHeader();
    return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/actualizarrol`, assignRolObject, 
      { headers });
  }
  // **********************************************************************************************
  // -- >> Procedimientos Planes
  addPlan(plan: AdminPlan) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/createplan`, plan, 
      { headers });
  }
  getAllPlanes() {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<AdminPlan[]>(`${environment.apiUrl}/users/listplanes`, 
      { headers });
  }
  getPlanById(id: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<AdminPlan>(`${environment.apiUrl}/users/getplanid?idPlan=${id}`, 
      { headers });
  }
  updatePlan(planUpdate: AdminPlan) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/updateplan`, planUpdate, 
      { headers });
  }
  deletePlan(idPlan: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.delete<ResponseMessage>(`${environment.apiUrl}/users/deleteplan?id=${idPlan}`, 
      { headers });
  }
  getPlanBusiness(idBusiness: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<AdminPlan>(`${environment.apiUrl}/users/getplanbusiness?idBusiness=${idBusiness}`, 
      { headers });
  }
  addPlanBusiness(planBusiness: AdminPlanXBusiness) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/createplanbusiness`, planBusiness, 
      { headers });
  }
  removePlanBusiness(idPlan: number,idBusiness: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.delete<ResponseMessage>(`${environment.apiUrl}/users/removeplanbusiness?idPlan=${idPlan}&idBusiness=${idBusiness}`, 
      { headers });
  }
  // **********************************************************************************************
  // -- >> Procedimientos Usuarios
  addUser(user: User) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/registrarusuario`, user, 
      { headers });
  }
  removeRoleUser(user: User) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/removerrolusuario`, user, 
      { headers });
  }
  updateUser(user: User) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.put<ResponseMessage>( `${environment.apiUrl}/users/actualizarusuario`, user, 
      { headers });
  }
  activateInactivateUser(user: User) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.put<ResponseMessage>( `${environment.apiUrl}/users/activarinactivarcuenta`, user,  
      { headers });
  }
  getAllUsers() {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<User[]>(`${environment.apiUrl}/users/getallusers`, 
      { headers });
  }
  getUserByIdentification(identification: string) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<User>(`${environment.apiUrl}/users/usuarioidentification?identUsuario=${identification}`, 
      { headers }); 
  }
  getUserBusiness(idUser:number, idEmpresa: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<User[]>(`${environment.apiUrl}/users/usuarioempresa?idUser=${idUser}&idEmpresa=${idEmpresa}`, 
      { headers });
  }
  getUsersBusiness(idEmpresa: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<User[]>( `${environment.apiUrl}/users/usuariosempresa?idEmpresa=${idEmpresa}`, 
      { headers });
  }
  getUsersBusinessScreenModule( idPantalla: number, idEmpresa: number, soloActivos: boolean) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<User[]>( 
      `${environment.apiUrl}/users/getusuariosaccesopantalla?idPantalla=${idPantalla}&idEmpresa=${idEmpresa}&soloActivos=${soloActivos}`, 
      { headers });
  }
  deleteUser(idUser: number, idBusiness: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.delete<ResponseMessage>(`${environment.apiUrl}/users/deleteuser?idUser=${idUser}&idBusiness=${idBusiness}`, 
      { headers }).pipe(map((response) => {
        if (idUser === this.userValue.id) { this.logout(); } return response; 
      }));
  }
  // **********************************************************************************************
  // MANTENIMIENTO DE PANTALLAS DE ACCESO POR MÓDULO
  getPantallasModulo( idModulo: number, idEmpresa: number, soloActivos: boolean) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<ScreenModule[]>(
      `${environment.apiUrl}/users/getpantallasmoduloempresa?idModulo=${idModulo}&idEmpresa=${idEmpresa}&soloActivos=${soloActivos}`, 
      { headers });
  }
  getPantallasNombre( nombrePantalla: string, idEmpresa: number,soloActivos: boolean) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.get<ScreenModule[]>(
      `${environment.apiUrl}/users/getpantallasnombreempresa?nombrePantalla=${nombrePantalla}&idEmpresa=${idEmpresa}&soloActivos=${soloActivos}`, 
      { headers });
  }
  postPantallaModulo(objeto: ScreenModule) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/createpantallamodulo`, objeto, 
      { headers });
  }
  deletePantallaModulo(id: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.delete<ResponseMessage>(`${environment.apiUrl}/users/deletepantallamodulo?id=${id}`, 
      { headers });
  }
  deleteAccesoPantallaUsuario( idUsuario: number, idPantalla: number,idEmpresa: number) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.delete<ResponseMessage>(
      `${environment.apiUrl}/users/deleteaccesspantallausuario?idUsuario=${idUsuario}&idPantalla=${idPantalla}&idEmpresa=${idEmpresa}`, 
      { headers });
  }
  putPantallaModulo(objeto: ScreenModule) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/updatepantallamodulo`, objeto, 
      { headers });
  }
  postPantallaAccesoUsuario(objeto: ScreenAccessUser) {
    const headers = this.creaObjetoHttpHeader();
    return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/createaccesspantallausuario`, objeto, 
      { headers });
  }
  // *********************************
}