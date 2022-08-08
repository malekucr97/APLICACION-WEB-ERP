import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Module, Role, ModuleRol, ResponseMessage, AssignRoleObject } from '@app/_models/';
import { Compania, CompaniaUsuario } from '@app/_models/modules/compania';
import { administrator, AuthStatesApp, httpLandingIndexPage } from '@environments/environment-access-admin';

@Injectable({ providedIn: 'root' })
export class AccountService {
    
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    private moduleSubject: BehaviorSubject<Module>;
    public moduleObservable: Observable<Module>;

    private businessSubject: BehaviorSubject<Compania>;
    public businessObservable: Observable<Compania>;

    constructor( private router: Router, private http: HttpClient ) {

        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();

        this.businessSubject = new BehaviorSubject<Compania>(JSON.parse(localStorage.getItem('Obusiness')));
        this.businessObservable = this.businessSubject.asObservable();

        this.moduleSubject = new BehaviorSubject<Module>(JSON.parse(localStorage.getItem('Omodule')));
        this.moduleObservable = this.moduleSubject.asObservable();
    }

    public get userValue():     User        { return this.userSubject.value;        }
    public get businessValue(): Compania    { return this.businessSubject.value;    }
    public get moduleValue():   Module      { return this.moduleSubject.value;      }

    public loadBusinessAsObservable(bus: Compania) {

        localStorage.removeItem('Obusiness');

        localStorage.setItem('Obusiness', JSON.stringify(bus));
        this.businessSubject.next(bus);
    }
    public loadModuleAsObservable(mod: Module) {

        localStorage.removeItem('Omodule');

        localStorage.setItem('Omodule', JSON.stringify(mod));
        this.moduleSubject.next(mod);
    }

    // -- >> ACTUALIZA USUARIO EN MEMORIA LOCAL
    updateLocalUser(user: User) {
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(user));
    }
    // -- >> ACTUALIZA COMPAÑÍA EN MEMORIA LOCAL
    updateLocalCompania(compania: Compania) {
        localStorage.removeItem('Obusiness');
        localStorage.setItem('Obusiness', JSON.stringify(compania));
    }

    // -- >> INICIA SESIÓN
    login(username, password) {
        return this.http.post<User>(`${environment.apiUrl}/users/autenticar`, { username, password })
            .pipe(map(user => {

                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);

                return user;
            }));
    }
    // -- >> CIERRA SESIÓN
    logout() {
        localStorage.removeItem('user');
        this.userSubject.next(null);

        localStorage.removeItem('Obusiness');
        this.businessSubject.next(null);

        localStorage.removeItem('Omodule');
        this.moduleSubject.next(null);

        this.router.navigate(['account/login']);
    }

    // -- >> Procedimientos Empresas
    getAllBusiness() {
        return this.http.get<Compania[]>(`${environment.apiUrl}/users/listadoempresas`);
    }
    getBusinessActiveUser(idUsuario: string) {
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
    assignBusinessUser(identificacionUsuario: string, idBusiness: number) {

        const assignBusinessUObject = new CompaniaUsuario();
        assignBusinessUObject.IdentificacionUsuario = identificacionUsuario;
        assignBusinessUObject.IdEmpresa = idBusiness;

        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/asignarsociedadusuario`, assignBusinessUObject);
    }
    dessAssignBusinessUser(identificacionUsuario: string, idBusiness: number) {

        const desAssignBusinessUObject = new CompaniaUsuario();
        desAssignBusinessUObject.IdentificacionUsuario = identificacionUsuario;
        desAssignBusinessUObject.IdEmpresa = idBusiness;

        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/desasignsociedadusuario`, desAssignBusinessUObject);
    }
    dessAssignAllBusinessUser(idUser: number) {

        let desAssignUserBusiness = new CompaniaUsuario();
        desAssignUserBusiness.IdUsuario = idUser;

        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/desasignallsociedu`, desAssignUserBusiness); 
    }


    // -- >> Procedientos Modulos
    activateModule(module: Module) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/activarmodulo`, module);
    }
    inActivateModule(module: Module) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/inactivarmodulo`, module);
    }
    assignModuleToBusiness(moduleToAssign: Module) {
        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/assignmodbusiness`, moduleToAssign);
    }
    desAssignModuleToBusiness(moduleId:number, idBusiness:number) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/users/desassignmodbusiness?idModule=${moduleId}&idBusiness=${idBusiness}`);
    }
    // getAllModules() {
    //     return this.http.get<Module[]>(`${environment.apiUrl}/users/listadomodulos`);
    // }
    getModulesBusiness(idEmpresa: number) {
        return this.http.get<Module[]>(`${environment.apiUrl}/users/modulossociedad?idEmpresa=${idEmpresa}`);
    }
    getModulesIdIdBusiness(identificador: string, idEmpresa: number) {
        return this.http.get<Module>(`${environment.apiUrl}/users/modididempresa?identificador=${identificador}&idEmpresa=${idEmpresa}`);
    }
    getModulesActiveBusiness(idEmpresa: number) {
        return this.http.get<Module[]>(`${environment.apiUrl}/users/modulosactsociedad?idEmpresa=${idEmpresa}`);
    }
    getModulesActiveUser(idEmpresa: number, idRol: string) {
        return this.http.get<Module[]>(`${environment.apiUrl}/users/modulosactusuario?idEmpresa=${idEmpresa}&idRol=${idRol}`);
    }
    getModulesSystem() {
        return this.http.get<Module[]>(`${environment.apiUrl}/users/modulossystem`);
    }
    // getModulesRol(idRol: string) {
    //     return this.http.get<Module[]>(`${environment.apiUrl}/users/modulosactrol?idRol=${idRol}`);
    // }
    getModulesRolBusiness(idRol: string, idEmpresa: number) {
        return this.http.get<Module[]>(`${environment.apiUrl}/users/modulosactrolempresa?idEmpresa=${idEmpresa}&idRol=${idRol}`);
    }
    addModuleRol(module: Module) {
        return this.http.post<Module>(`${environment.apiUrl}/users/registrarmodulo`, module);
    }
    accessModule(idRol: string, idModulo: number) {

        let accessMod = new ModuleRol();
        accessMod.IdRol = idRol;
        accessMod.IdModulo = idModulo;

        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/accesomodulo`, accessMod);
    }
    deleteModule(idModulo: number) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/users/eliminarmodulo?idModulo=${idModulo}`);
    }
    deleteAccessModule(idRol: string, idModulo: number, ) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/users/eliminaraccesomodulo?idRol=${idRol}&idModulo=${idModulo}`);
    }

    // -- >> Procedimientos de Usuarios
    // async validateLoginUser(user:User=null) : Promise<string> {

    //     let indexRedirect : string = '/';

    //     if (AuthStatesApp.inactive === user.estado) { 
    //         return httpLandingIndexPage.indexHTTPInactiveUser;
    //     }
    //     if (AuthStatesApp.pending === user.estado) {
    //         return httpLandingIndexPage.indexHTTPPendingUser;
    //     }
        
    //     return indexRedirect;        
    // }
    addUser(user: User) { 
        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/registrarusuario`, user); 
    }

    removeRoleUser(user: User) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/removerrolusuario`, user);
    }
    updateUser(id, user: User) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/actualizarusuario`, user)
            .pipe(map(x => {
                // actualiza la información del usuario local si es quien se está en la sesión
                if (id === this.userValue.id) {
                    localStorage.setItem('user', JSON.stringify(user));
                    this.userSubject.next(user);
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
    getUserById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/usuarioid?idUsuario=${id}`);
    }
    getUsersBusiness(idEmpresa: number) {
        return this.http.get<User[]>(`${environment.apiUrl}/users/usuariosempresa?idEmpresa=${idEmpresa}`);
    }
    activateUser(user: User) {
        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/activarcuenta`, user);
    }
    inActivateUser(user: User) {
        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/inactivarcuenta`, user);
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
