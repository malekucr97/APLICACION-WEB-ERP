// ## ** enviroment desarrollo ** ## //

export const environment = {
    production: false,
    apiUrl: 'http://localhost:4000'
};

export const administrator = {
    // production: true,
    identification: 'adminboss',
    state: 'admin',
    urlRedirect: '',
    adminSociedad: 'admin-e',
    rolAdministrator: 1
};

export const register = {
    // production: true,
    state: 'Registrado',
    urlRedirect: ''
};

export const pending = {
    // production: true,
    state: 'Pendiente',
    urlRedirect: ''
};

export const active = {
    // production: true,
    state: 'Activo',
    urlRedirect: ''
};

export const inactive = {
    // production: false,
    state: 'Inactivo',
    urlRedirect: ''
};

export const httpLandingIndexPage = {

    // -- >> Home Page Index Application
    homeHTTP: '/',
    // -- >> Langing Pages Index Application
    indexHTTP: '/inra-sa/index.html',
    // -- >> Langing No Loggin Application
    indexHTTPPendingUser:       '/inra-sa/PendingPage/index.html',
    indexHTTPNotRolUser:        '/inra-sa/NotRolPage/index.html',
    indexHTTPInactiveUser:      '/inra-sa/InactiveUserPage/index.html',
    indexHTTPInactiveRolUser:   '/inra-sa/InactiveRolPage/index.html',
    indexHTTPBlockedUser:       '/inra-sa/BlockedUserPage/index.html',
    indexHTTPNoBussinesUser:    '/inra-sa/NotBusinessPage/index.html'
    // ,
    // urlPageNotBusiness:         '/inra-sa/NotBusinessPage/index.html'
};

export const ModulesSystem = {

    Identif_ActivosFijos:   'ID-BANKAP-ACT-FIJ',
    activosfijosbasehref:   '/inra-sa/modulo-activos-fijos/',

    Identif_Bancos:         'ID-BANKAP-BANCOS',
    bancosbasehref:         '/inra-sa/modulo-bancos/',

    Identif_Contabilidad:   'ID-BANKAP-CONTA',
    contabilidadbasehref:   '/inra-sa/modulo-contabilidad/',

    Identif_CuentasCobrar:  'ID-BANKAP-CXC',
    cuentascobrarbasehref:  '/inra-sa/modulo-cuentas-cobrar/',

    Identif_CuentasPagar:   'ID-BANKAP-CXP',
    cuentaspagarbasehref:   '/inra-sa/modulo-cuentas-pagar/',

    Identif_Facturacion:    'ID-BANKAP-FACTURA-E',
    facturacionbasehref:    '/inra-sa/modulo-facturacion/',

    Identif_Generales:      'ID-BANKAP-GENERAL',
    generalesbasehref:      '/inra-sa/modulo-generales/',

    Identif_Inventario:     'ID-BANKAP-INVENTARIO',
    inventariobasehref:     '/inra-sa/modulo-inventario/',

    Identif_Cumplimiento:   'ID-BANKAP-CUMPLIMIENTO',
    cumplimientobasehref:   '/inra-sa/modulo-cumplimiento/',

    Identif_Macred:         'ID-BANKAP-MACRED',
    macredbasehref:         '/inra-sa/modulo-macred/',

    Identif_RiesgoCredito:  'ID-BANKAP-RIESGO-CREDITO',
    riesgocreditobasehref:  '/inra-sa/modulo-riesgo-credito/',

    Identif_Inversiones:  'ID-BANKAP-INVERSIONES',
    inversionesbasehref:  '/inra-sa/modulo-inversiones/',

    Identif_PowerBI:  'ID-BANKAP-BI',
    powerbibasehref:  '/inra-sa/modulo-powerbi/',
};

export const httpAccessAdminPage = {

    // ********************************
    // -- >> inicio de sesión *********
    // ********************************
    URLLoginPage: 'account/login',

    // *************************************************
    // -- >> Página de Administración del Sistema *******
    // *************************************************
    urlPageListModule:          '/admin-module/adminpage-listmodules.html/',
    urlPageAdministrator:       '/admin-module/adminpage-indexadmin.html/',
    urlPageAddEditBusiness:     '/admin-module/adminpage-addeditbusiness.html/',
    urlPageListBusinessModule:  '/admin-module/adminpage-listmodulebusiness.html/',
    urlPageListBusiness:        '/admin-module/adminpage-listbusiness.html/',
    urlPageListRole:            '/admin-module/adminpage-listroles.html/',
    urlPageListUsers:           '/admin-module/adminpage-listusers.html',
    urlPageAddEditUser:         '/admin-module/adminpage-addedituser.html/',
    urlPageAddBUser:            '/admin-module/adminpage-addbusinessuser.html/',
    urlPageAddRUser:            '/admin-module/adminpage-addroleuser.html/',
    urlPageAddModuleRol:        '/admin-module/adminpage-addmodulerol.html/',
    urlPageAdminModule:         '/admin-module/adminpage-adminmodule.html/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
