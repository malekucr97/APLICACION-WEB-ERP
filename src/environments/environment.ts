// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiUrl: 'http://localhost:4000'
};

export const administrator = {
    production: false,
    esAdministrador: 1,
    id: 'adminboss',
    state: 'admin',
    urlRedirect: '/_AdminModule/AdminUserPage/'
};

export const AuthApp = {
    active: 'Activo',
    inactive: 'Inactivo',
    pending: 'Pendiente'
};

export const httpAccessPage = {
    URLPageAccount: '/account/login/',


    urlPageAdministrator: '/_AdminModule/AdminUserPage/',

    // -- >> Langing Pages Sistem
    urlPagePending: '/_LandingModule/PendingPage/',
    urlPageNotRol: '/_LandingModule/NotRolPage/',
    urlPageInactiveUser: '/_LandingModule/InactiveUserPage/',
    urlPageInactiveRol: '/_LandingModule/InactiveRolPage/',
    urlPageBusinessIndex: '_LandingModule/BusinessPage',
    urlPageNotBusiness: '/_LandingModule/NotBusinessPage/',

    // -- >> Admin Pages Sistem
    urlPageConfigUser: '/_AdminModule/AddEditUserPage/',
    urlPageAddEditUser: '/_AdminModule/AddEditUserPage/',
    urlPageListUsers: '/_AdminModule/AdminListUserPage/',
    urlPageAddBUser: '/_AdminModule/AddBusinessUserPage/',
    urlPageAddRUser: '/_AdminModule/AddRoleUserPage/',

    urlPageListBusiness: '/_AdminModule/AdminListBusinessPage/',

    urlPageListRole: '/_AdminModule/AdminListRolePage/',

    urlPageAddModuleRol: '/_AdminModule/AddModuleRolePage/',

    // -- >> MODULO DE GENERALES
    urlIndexGenerales: '/_GeneralesModule/IndexGeneralesPage/'
};

export const amdinBusiness = {
    production: false,
    adminSociedad: 'admin-e',
    state: 'Activo',
    urlRedirect: ''
};

export const localVariables = {
    dir_img_modules: '/assets/images/inra/ModulosBankap/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
