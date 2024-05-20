// ## ** enviroment producción ** ## //

export const environment = {
    production: true,
    apiUrl: 'https://apibiwindows.azurewebsites.net',

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
    indexHTTP: '/inra-sa/index.html',
    // -- >> Langing No Loggin Application
    indexHTTPPendingUser:       '/inra-sa/PendingPage/index.html',
    indexHTTPNotRolUser:        '/inra-sa/NotRolPage/index.html',
    indexHTTPInactiveUser:      '/inra-sa/InactiveUserPage/index.html',
    indexHTTPInactiveRolUser:   '/inra-sa/InactiveRolPage/index.html',
    indexHTTPBlockedUser:       '/inra-sa/BlockedUserPage/index.html',
    indexHTTPNoBussinesUser:    '/inra-sa/NotBusinessPage/index.html',
    indexHTTPNoModulesUser:     '/inra-sa/NotModulesPage/index.html'
};

export const ModulesSystem = {

    Identif_Generales: 'ID-BANKAP-GENERAL',
    generalesbasehref: '/inra-sa/general-module/',

    Identif_PowerBI: 'ID-BANKAP-BI',
    powerbibasehref: '/inra-sa/powerbi-module/'
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