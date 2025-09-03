// ## ** enviroment producción ** ## //

export const environment = {
    production: true,
    apiUrl: 'http://localhost:4000',

    sessionStorageIdentificationUserKey: '_httpUsernameSessionStorageAppAdminModulesInraSA',
    sessionStorageModuleIdentification : '_httpModuleSelectedSessionStorageAppAdminModulesInraSA'
};

export const administrator = {
    identification: 'adminboss',
    state: 'admin',
    adminSociedad: 'admin-e'
};

export const register = {
    state: 'Registrado',
    urlRedirect: ''
};

export const pending = {
    state: 'Pendiente',
    urlRedirect: ''
};

export const active = {
    state: 'Activo',
    urlRedirect: ''
};

export const inactive = {
    state: 'Inactivo',
    urlRedirect: ''
};

export const httpLandingIndexPage = {

    // -- >> Home Page Index Application
    homeHTTP: '/',
    // -- >> Langing Pages Index Application
    indexHTTP: '/maleku-ti/index.html',
    // -- >> Langing No Loggin Application
    indexHTTPPendingUser:       '/maleku-ti/PendingPage/index.html',
    indexHTTPNotRolUser:        '/maleku-ti/NotRolPage/index.html',
    indexHTTPInactiveUser:      '/maleku-ti/InactiveUserPage/index.html',
    indexHTTPInactiveRolUser:   '/maleku-ti/InactiveRolPage/index.html',
    indexHTTPBlockedUser:       '/maleku-ti/BlockedUserPage/index.html',
    indexHTTPNoBussinesUser:    '/maleku-ti/NotBusinessPage/index.html',
    indexHTTPNoModulesUser:     '/maleku-ti/NotModulesPage/index.html'
};

export const ModulesSystem = {

    Identif_Generales: 'ID-BANKAP-GENERAL',
    generalesbasehref: '/maleku-ti/general-module/',

    Identif_PowerBI: 'ID-BANKAP-BI',
    powerbibasehref: '/maleku-ti/powerbi-module/',

    Identif_Macred: 'ID-BANKAP-MACRED',
    macredbasehref: '/maleku-ti/macred-module/',

    Identif_RiesgoCredito: 'ID-BANKAP-RIESGO-CREDITO',
    riesgocreditobasehref: '/maleku-ti/riesgo-credito-module/',

    Identif_TipoCambio: 'ID-TIPO-CAMBIO',
    tipocambiobasehref: '/maleku-ti/tipo-cambio-module/'
};

export const httpAccessAdminPage = {

    // ********************************
    // -- >> inicio de sesión *********
    // ********************************
    URLPageAccount: 'account/login',

    // *************************************************
    // -- >> Página de Administración del Sistema ******
    // *************************************************
    urlPageListModule:          '/admin-module/adminpage-listmodules.html/',
    urlPageAdministrator:       '/admin-module/adminpage-indexadmin.html/',
    urlPageAddEditBusiness:     '/admin-module/adminpage-addeditbusiness.html/',
    urlPageListBusinessModule:  '/admin-module/adminpage-listmodulebusiness.html/',
    urlPageListBusiness:        '/admin-module/adminpage-listbusiness.html/',
    urlPageListRole:            '/admin-module/adminpage-listroles.html/',
    urlPageAddEditRol:          '/admin-module/adminpage-addeditrol.html/',
    urlPageListUsers:           '/admin-module/adminpage-listusers.html',
    urlPageAddEditUser:         '/admin-module/adminpage-addedituser.html/',
    urlPageListPlan:            '/admin-module/adminpage-listplan.html/',
    urlPageAddEditPlan:         '/admin-module/adminpage-addeditplan.html/',
    urlPageAddBUser:            '/admin-module/adminpage-addbusinessuser.html/',
    urlPageAddRUser:            '/admin-module/adminpage-addroleuser.html/',
    urlPageAddModuleRol:        '/admin-module/adminpage-addmodulerol.html/',
    urlPageAdminModule:         '/admin-module/adminpage-adminmodule.html/'
};