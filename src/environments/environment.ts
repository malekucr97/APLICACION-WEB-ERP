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
    // -- >> Acceso
    URLPageAccount: '/account/login/',

    // -- >> Administración
    urlPageAdministrator: '/_AdminModule/AdminUserPage/',
    urlPageConfigUser: '/_AdminModule/AddEditUserPage/',
    urlPageAddEditUser: '/_AdminModule/AddEditUserPage/',
    urlPageListUsers: '/_AdminModule/AdminListUserPage/',
    urlPageAddBUser: '/_AdminModule/AddBusinessUserPage/',
    urlPageAddRUser: '/_AdminModule/AddRoleUserPage/',
    urlPageListBusiness: '/_AdminModule/AdminListBusinessPage/',
    urlPageListRole: '/_AdminModule/AdminListRolePage/',
    urlPageAddModuleRol: '/_AdminModule/AddModuleRolePage/',

    // -- >> Langing Pages Index Application
    urlContentIndex: '/_LandingModule/IndexContentPage/',
    // -- >> Langing No Application
    urlPagePending: '/_LandingModule/PendingPage/NoLogin/Index.html',
    urlPageNotRol: '/_LandingModule/NotRolPage/NoLogin/Index.html',
    urlPageInactiveUser: '/_LandingModule/InactiveUserPage/NoLogin/Index.html',
    urlPageInactiveRol: '/_LandingModule/InactiveRolPage/NoLogin/Index.html',
    urlPageNotBusiness: '/_LandingModule/NotBusinessPage/NoLogin/Index.html'
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

export const ModulesSistem = {
    ActivosFijos: 'ID-BANKAP-ACT-FIJ',
    ActivosFijosURL: '/_ActivosFijosModule/Index/',

    Bancos: 'ID-BANKAP-BANCOS',
    BancosURL: '/_BancosModule/Index/',

    Contabilidad: 'ID-BANKAP-CONTA',
    ContabilidadURL: '/_ContabilidadModule/Index/',

    CuentasCobrar: 'ID-BANKAP-CXC',
    CuentasCobrarURL: '/_CuentasCobrarModule/Index/',

    CuentasPagar: 'ID-BANKAP-CXP',
    CuentasPagarURL: '/_CuentasPagarModule/Index/',

    FacturaElectronica: 'ID-BANKAP-FACTURA-E',
    FacturaElectronicaURL: '/_FacturaElectronicaModule/Index/',

    Generales: 'ID-BANKAP-GENERAL',
    GeneralesURL: '/_GeneralesModule/Index/',

    Inventario: 'ID-BANKAP-INVENTARIO',
    InventarioURL: '/_InventarioModule/Index/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
