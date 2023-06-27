export const environment    = { apiUrlAccessAdmin: 'http://localhost:4000' };
export const administrator  = { esAdministrador: 1,
                                id: 'adminboss' };
export const amdinBusiness  = { adminSociedad: 'admin-e' };
export const AuthStatesApp  = { active: 'Activo',
                                inactive: 'Inactivo',
                                pending: 'Pendiente' };

export const httpAccessAdminPage = {

    // ********************************
    // -- >> inicio de sesión *********
    // ********************************
    URLPageAccount: '/account/login/',

    // *************************************************
    // -- >> Págia de Administración del Sistema *******
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
    urlPageNotBusiness:         '/inra-sa/NotBusinessPage/index.html'
};
