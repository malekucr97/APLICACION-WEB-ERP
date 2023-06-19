import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Module, Role, ModuleRolBusiness, ResponseMessage, AssignRoleObject } from '@app/_models/';
import { Compania, CompaniaUsuario } from '@app/_models/modules/compania';
import { ScreenAccessUser } from '@app/_models/admin/screenAccessUser';
import { ScreenModule } from '@app/_models/admin/screenModule';

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
    private listUsersSubject        : BehaviorSubject<User[]> ;
    private listRolesSubject        : BehaviorSubject<Role[]> ;
    private listBusinessSubject     : BehaviorSubject<Compania[]> ;

    // **************************************************************
    // ************************* CONSTRUCTOR ************************
    // **************************************************************
    constructor( private router: Router, private http: HttpClient ) {

        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();

        this.businessSubject = new BehaviorSubject<Compania>(JSON.parse(localStorage.getItem('Obusiness')));
        this.businessObservable = this.businessSubject.asObservable();

        this.moduleSubject = new BehaviorSubject<Module>(JSON.parse(localStorage.getItem('Omodule')));
        this.moduleObservable = this.moduleSubject.asObservable();
    }

    // ******************************************************************************
    // ****************************** MÉTODOS ACCESORES *****************************
    // ******************************************************************************
    public get userListValue(): User[] { 
        if (this.listUsersSubject) {
            return this.listUsersSubject.value;   
        }
        return null;
    }
    public get rolListValue(): Role[] { 
        if (this.listRolesSubject) {
            return this.listRolesSubject.value;
        }
        return null;
    }
    public get businessListValue(): Compania[] { 
        if (this.listBusinessSubject) {
            return this.listBusinessSubject.value;
        }
        return null;
    }
    
    public get userValue():     User        { return this.userSubject.value;        }
    public get businessValue(): Compania    { return this.businessSubject.value;    }
    public get moduleValue():   Module      { return this.moduleSubject.value;      }
    // ******************************************************************************

    // *******************************************************************
    // ********************** MÉTODOS SUBSCRIPTORES **********************
    // *******************************************************************
    // -- >> Suscribe lista de usuario para administración
    public suscribeListUser(listaUsuarios : User[]) : void {
        this.listUsersSubject = new BehaviorSubject<User[]>(listaUsuarios);
    }
    // -- >> Actualiza lista de usuario administración
    public loadListUsers(listaUsuarios : User[]) : void {
        this.listUsersSubject.next(listaUsuarios);
    }
    // -- >> Suscribe lista de roles para administración
    public suscribeListRol(listaRoles : Role[]) : void {
        this.listRolesSubject = new BehaviorSubject<Role[]>(listaRoles);
    }
    // -- >> Actualiza lista de roles administración
    public loadListRol(listaRoles : Role[]) : void {
        this.listRolesSubject.next(listaRoles);
    }
    // -- >> Suscribe lista de roles para administración
    public suscribeListBusiness(listaRoles : Compania[]) : void {
        this.listBusinessSubject = new BehaviorSubject<Compania[]>(listaRoles);
    }
    // -- >> Actualiza lista de roles administración
    public loadListBusiness(listaCompanias : Compania[]) : void {
        this.listBusinessSubject.next(listaCompanias);
    }

    // -- >> Actualiza Objeto Compañía en memoria y subcripción
    public loadBusinessAsObservable(bus: Compania) {

        localStorage.removeItem('Obusiness');
        localStorage.setItem('Obusiness', JSON.stringify(bus));

        this.businessSubject.next(bus);
    }
    // -- >> Actualiza Objeto Módulo en memoria y subcripción
    public loadModuleAsObservable(mod: Module) {

        localStorage.removeItem('Omodule');
        localStorage.setItem('Omodule', JSON.stringify(mod));

        this.moduleSubject.next(mod);
    }
    // -- >> Actualiza Objeto uSUARIO en memoria y subcripción
    loadUserAsObservable(user: User) {
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(user));

        this.userSubject.next(user);
    }
    // *******************************************************************

    validateAccessUser(idUser:number, idModule:number, nombrePantalla:string, idBusiness:number) {
        return this.http.get<ResponseMessage>(`${environment.apiUrl}/users/validaaccesopantalla?idUsuario=${idUser}
                                                                                                &idModulo=${idModule}
                                                                                                &nomPantalla=${nombrePantalla}
                                                                                                &îdEmpresa=${idBusiness}`);
    }
    
    // **********************************************************************************************
    // -- >> Inicio de Sesión
    login(username, password) {
        return this.http.post<User>(`${environment.apiUrl}/users/autenticar`, { username, password })
            .pipe(map(user => {

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

    // -- >> Procedimientos Empresas
    getAllBusiness() {
        return this.http.get<Compania[]>(`${environment.apiUrl}/users/listadoempresas`);
    }
    getBusinessActiveUser(idUsuario: number) {
        return this.http.get<Compania[]>(`${environment.apiUrl}/users/empresasusuarioactivas?idUsuario=${idUsuario}`);
    }
    getBusinessById(idEmpresa: number) {
        return this.http.get<Compania>(`${environment.apiUrl}/users/empresaid?idEmpresa=${idEmpresa}`);
    }
    
    addBusiness(business: Compania) {
        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/registrarempresa`, business);
    }
    updateBusiness(business: Compania) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/actualizarempresa`, business);
    }
    assignBusinessUser(idUser: number, idBusiness: number) {

        let assignBusinessUObject = new CompaniaUsuario();
        assignBusinessUObject.IdUsuario = idUser;
        assignBusinessUObject.IdEmpresa = idBusiness;

        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/asignarsociedadusuario`, assignBusinessUObject);
    }
    dessAssignBusinessUser(idUser: number, idBusiness: number) {

        const desAssignBusinessUObject = new CompaniaUsuario();
        desAssignBusinessUObject.IdUsuario = idUser;
        desAssignBusinessUObject.IdEmpresa = idBusiness;

        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/desasignsociedadusuario`, desAssignBusinessUObject);
    }
    dessAssignAllBusinessUser(idUser: number) {

        let desAssignUserBusiness = new CompaniaUsuario();
        desAssignUserBusiness.IdUsuario = idUser;

        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/desasignallsociedu`, desAssignUserBusiness); 
    }

    // **********************************************************************************************
    // -- >> MODULOS
    getModulesSystem() {
        return this.http.get<Module[]>(`${environment.apiUrl}/users/modulossistema`);
    }
    getModulesBusiness(idEmpresa: number) {
        return this.http.get<Module[]>(`${environment.apiUrl}/users/modulossociedad?idEmpresa=${idEmpresa}`);
    }
    getModuleId(idModule: number) {
        return this.http.get<Module>(`${environment.apiUrl}/users/getmoduloid?idModule=${idModule}`);
    }

    getModulesByRolAndBusiness(idRol: string, idEmpresa: number) {
        return this.http.get<Module[]>(`${environment.apiUrl}/users/modulosrolempresa?idEmpresa=${idEmpresa}&idRol=${idRol}`);
    }
    deleteAccessModuleToRol(idRol: string, idModulo: number, idEmpresa: number) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/users/eliminaraccesomodulo?idRol=${idRol}&idModulo=${idModulo}&idEmpresa=${idEmpresa}`);
    }
    grantAccessModuleToRol(idRol: string, idModulo: number, idBusiness: number) {

        let accessMod : ModuleRolBusiness = new ModuleRolBusiness();
        accessMod.IdRol = idRol;
        accessMod.IdModulo = idModulo;
        accessMod.IdBusiness = idBusiness;

        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/otorgaraccesoamodulo`, accessMod);
    }
    
    activateModule(idModule: number, idEmpresa:number) {
        let activateMod : ModuleRolBusiness = new ModuleRolBusiness();
        activateMod.IdModulo = idModule;
        activateMod.IdBusiness = idEmpresa;

        return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/activarmodulo`, activateMod);
    }
    inActivateModule(idModule: number, idBusiness: number) {
        let inActivateMod : ModuleRolBusiness = new ModuleRolBusiness();
        inActivateMod.IdModulo = idModule;
        inActivateMod.IdBusiness = idBusiness;

        return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/inactivarmodulo`, inActivateMod);
    }
    assignModuleToBusiness(idModule: number, idBusiness: number) {
        let moduleToBusiness : ModuleRolBusiness = new ModuleRolBusiness();
        moduleToBusiness.IdModulo = idModule;
        moduleToBusiness.IdBusiness = idBusiness;

        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/asignarmodulosociedad`, moduleToBusiness);
    }
    desAssignModuleToBusiness(moduleId:number, idEmpresa:number) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/users/desasigmodsociedad?idModulo=${moduleId}&idEmpresa=${idEmpresa}`);
    }
    getModulesActiveBusiness(idEmpresa: number) {
        return this.http.get<Module[]>(`${environment.apiUrl}/users/modulosactsociedad?idEmpresa=${idEmpresa}`);
    }
    getModulesActiveUser(idEmpresa: number, idRol: string) {
        return this.http.get<Module[]>(`${environment.apiUrl}/users/modulosactusuario?idEmpresa=${idEmpresa}&idRol=${idRol}`);
    }
    addModuleRol(module: Module) {
        return this.http.post<Module>(`${environment.apiUrl}/users/registrarmodulo`, module);
    }
    deleteModule(idModulo: number) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/users/eliminarmodulo?idModulo=${idModulo}`);
    }
    
    // *********************************
    // *********************************
    // MANTENIMIENTO DE PANTALLAS DE ACCEDO POR MÓDULO
    getPantallasModulo(idModulo : number, idEmpresa: number, soloActivos : boolean) {
        return this.http.get<ScreenModule[]>(`${environment.apiUrl}/users/getpantallasmoduloempresa?idModulo=${idModulo}&idEmpresa=${idEmpresa}&soloActivos=${soloActivos}`);
    }
    getPantallasNombre(nombrePantalla : string, idEmpresa: number, soloActivos : boolean) {
        return this.http.get<ScreenModule[]>(`${environment.apiUrl}/users/getpantallasnombreempresa?nombrePantalla=${nombrePantalla}&idEmpresa=${idEmpresa}&soloActivos=${soloActivos}`);
    }
    postPantallaModulo(objeto: ScreenModule) {
        return this.http.post<ScreenModule>(`${environment.apiUrl}/users/createpantallamodulo`, objeto);
    }
    deletePantallaModulo( id : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/users/deletepantallamodulo?id=${id}`);
    }
    deleteAccesoPantallaUsuario( idUsuario : number, idPantalla : number, idEmpresa : number ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/users/deleteaccesspantallausuario?idUsuario=${idUsuario}&idPantalla=${idPantalla}&idEmpresa=${idEmpresa}`);
    }
    putPantallaModulo(objeto:ScreenModule) {
        return this.http.put<ScreenModule>(`${environment.apiUrl}/users/updatepantallamodulo`, objeto);
    }
    postPantallaAccesoUsuario(objeto: ScreenAccessUser) {
        return this.http.post<ScreenAccessUser>(`${environment.apiUrl}/users/createaccesspantallausuario`, objeto);
    }
    // *********************************

    addUser(user: User) { 
        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/registrarusuario`, user); 
    }
    removeRoleUser(user: User) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/removerrolusuario`, user);
    }
    updateUser(id:string, user: User) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/actualizarusuario`, user)
            .pipe(map(x => {
                // actualiza la información del usuario local si es quien se está en la sesión
                if (id === this.userValue.identificacion) {

                    this.userValue.email = user.email;
                    this.userValue.nombreCompleto = user.nombreCompleto;
                    this.userValue.numeroTelefono = user.numeroTelefono;
                    this.userValue.password = user.password;

                    localStorage.setItem('user', JSON.stringify(this.userValue));
                    this.userSubject.next(this.userValue);
                }
                return x;
            }));
    }
    getAllUsers() {
        return this.http.get<User[]>(`${environment.apiUrl}/users/getallusers`);
    }
    getUser(usuarioid: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${usuarioid}`);
    }
    getUserByIdentification(identification: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/usuarioidentification?identUsuario=${identification}`);
    }
    getUsersBusiness(idEmpresa: number) {
        return this.http.get<User[]>(`${environment.apiUrl}/users/usuariosempresa?idEmpresa=${idEmpresa}`);
    }
    getUsersBusinessScreenModule(idPantalla : number, idEmpresa: number, soloActivos : boolean) {
        return this.http.get<User[]>(`${environment.apiUrl}/users/getusuariosaccesopantalla?idPantalla=${idPantalla}&idEmpresa=${idEmpresa}&soloActivos=${soloActivos}`);
    }
    activateUser(user: User) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/activarcuenta`, user);
    }
    inActivateUser(user: User) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/inactivarcuenta`, user);
    }
    deleteUser(idUser: number) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/users/deleteuser?idUser=${idUser}`)
            .pipe(map(x => {
                // -- >> si se elimina el usuario de la sesión se cierra sesión
                if (idUser === this.userValue.id) { this.logout(); }
                return x;
            }));
    }

    // -- >> Procedimientos de Roles
    getRoleById(idRol: string) { 
        return this.http.get<Role>(`${environment.apiUrl}/users/roleid?idRol=${idRol}`); 
    }
    getAllRoles() {
        return this.http.get<Role[]>(`${environment.apiUrl}/users/getallroles`);
    }
    getRolesBusiness(idEmpresa: number) {
        return this.http.get<Role[]>(`${environment.apiUrl}/users/rolesempresa?idEmpresa=${idEmpresa}`);
    }
    assignRoleUser(idRole: string, idUser: string) {

        const assignRolObject = new AssignRoleObject();
        assignRolObject.idRole = idRole;
        assignRolObject.idUser = idUser;

        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/asignarrolusuario`, assignRolObject);
    }
    updateRol(rol: Role) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/actualizarrol`, rol);
    }
    registerRole(role: Role) {
        return this.http.post(`${environment.apiUrl}/users/registrarrol`, role);
    }
}
