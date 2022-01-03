import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Business, Module, BusinessUser, Role, ModuleRol, ResponseMessage, AssignRoleObject } from '@app/_models/';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    private moduleSubject: BehaviorSubject<Module>;
    public moduleObservable: Observable<Module>;

    private businessSubject: BehaviorSubject<Business>;
    public businessObservable: Observable<Business>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();

        this.businessSubject = new BehaviorSubject<Business>(JSON.parse(localStorage.getItem('Obusiness')));
        this.businessObservable = this.businessSubject.asObservable();

        this.moduleSubject = new BehaviorSubject<Module>(JSON.parse(localStorage.getItem('Omodule')));
        this.moduleObservable = this.moduleSubject.asObservable();
    }

    public get userValue(): User { return this.userSubject.value; }
    public get businessValue(): Business { return this.businessSubject.value; }
    public get moduleValue(): Module { return this.moduleSubject.value; }

    public loadBusinessAsObservable(bus: Business) {
        localStorage.removeItem('Obusiness');

        localStorage.setItem('Obusiness', JSON.stringify(bus));
        this.businessSubject.next(bus);
    }
    public loadModuleAsObservable(mod: Module) {
        localStorage.removeItem('Omodule');

        localStorage.setItem('Omodule', JSON.stringify(mod));
        this.moduleSubject.next(mod);
    }

    // -- >> ACTUALIZA EL USUARIO EN LA MEMORIA LOCAL
    updateLocalUser(user: User) {
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(user));
    }

    // -- >> ADMINISTRACIÓN DE ACCESO
    login(username, password) {
        return this.http.post<User>(`${environment.apiUrl}/users/autenticar`, { username, password })
            .pipe(map(user => {

                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);

                return user;
            }));
    }
    logout() {
        localStorage.removeItem('user');
        this.userSubject.next(null);

        localStorage.removeItem('Obusiness');
        localStorage.removeItem('Omodule');

        this.router.navigate(['account/login']);
    }
    // -- >> FIN


    registerRole(role: Role) {
        return this.http.post(`${environment.apiUrl}/users/registrarrol`, role);
    }

    // -- >> Procedimientos Empresas
    getAllBusiness() {
        return this.http.get<Business[]>(`${environment.apiUrl}/users/listadoempresas`);
    }
    getBusinessActiveUser(idUsuario: string) {
        return this.http.get<Business[]>(`${environment.apiUrl}/users/empresasusuarioactivas?idUsuario=${idUsuario}`);
    }
    getBusinessById(idEmpresa: number) {
        return this.http.get<Business>(`${environment.apiUrl}/users/empresaid?idEmpresa=${idEmpresa}`);
    }
    addBusiness(business: Business) {
        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/registrarempresa`, business);
    }
    updateBusiness(business: Business) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/actualizarempresa`, business);
    }
    assignBusinessUser(identificacionUsuario: string, idBusiness: number) {

        const assignBusinessUObject = new BusinessUser();
        assignBusinessUObject.IdentificacionUsuario = identificacionUsuario;
        assignBusinessUObject.IdEmpresa = idBusiness;

        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/asignarsociedadusuario`, assignBusinessUObject);
    }
    dessAssignBusinessUser(identificacionUsuario: string, idBusiness: number) {

        const desAssignBusinessUObject = new BusinessUser();
        desAssignBusinessUObject.IdentificacionUsuario = identificacionUsuario;
        desAssignBusinessUObject.IdEmpresa = idBusiness;

        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/desasignsociedadusuario`, desAssignBusinessUObject);
    }
    dessAssignAllBusinessUser(identificacionUsuario: string) {

        const desAssignBusinessUObject = new BusinessUser();
        desAssignBusinessUObject.IdentificacionUsuario = identificacionUsuario;

        return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/desasignallsociedu`, desAssignBusinessUObject); }
    // -- >> fin


    // -- >> Procedientos Modulos
    activateModule(module: Module) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/activarmodulo`, module);
    }
    inActivateModule(module: Module) {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/users/inactivarmodulo`, module);
    }
    getAllModules() {
        return this.http.get<Module[]>(`${environment.apiUrl}/users/listadomodulos`);
    }
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
    getModulesActive() {
        return this.http.get<Module[]>(`${environment.apiUrl}/users/modulosact`);
    }
    getModulesRol(idRol: string) {
        return this.http.get<Module[]>(`${environment.apiUrl}/users/modulosactrol?idRol=${idRol}`);
    }
    getModulesRolBusiness(idRol: string, idEmpresa: number) {
        return this.http.get<Module[]>(`${environment.apiUrl}/users/modulosactrolempresa?idEmpresa=${idEmpresa}&idRol=${idRol}`);
    }
    addModuleRol(module: Module) {
        return this.http.post<Module>(`${environment.apiUrl}/users/registrarmodulo`, module);
    }
    accessModule(idRol: string, idModulo: number) {

        const accessMod = new ModuleRol();
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
    // -- >> fin

    // -- >> Procedimientos de Usuarios
    addUser(user: User) { return this.http.post<ResponseMessage>(`${environment.apiUrl}/users/registrarusuario`, user); }

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
    deleteUser(identificationuser: string) {
        return this.http.delete<ResponseMessage>(`${environment.apiUrl}/users/${identificationuser}`)
            .pipe(map(x => {
                // -- >> si se elimina el usuario de la sesión se cierra sesión
                if (identificationuser === this.userValue.identificacion) { this.logout(); }
                return x;
            }));
    }
    // -- >> fin

    // -- >> Procedimientos de Roles
    getRoleById(idRol: string) { return this.http.get<Role>(`${environment.apiUrl}/users/roleid?idRol=${idRol}`); }
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
    // -- >> fin
}
