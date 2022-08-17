export const environment = {
    apiUrlAccessAdmin: 'http://localhost:4000'
};
export const administrator = {
    esAdministrador: 1,
    id: 'adminboss'
};
export const amdinBusiness = {
    adminSociedad: 'admin-e'
};
export const AuthStatesApp = {
    active: 'Activo',
    inactive: 'Inactivo',
    pending: 'Pendiente'
};

export const httpAccessAdminPage = {
    
    // ********************************
    // -- >> inicio de sesión *********
    // ********************************
    URLPageAccount: '/account/login/',
    // ********************************
    
    // *************************************************
    // -- >> Págia de Administración del Sistema *******
    // *************************************************
    urlPageAdministrator: '/_AdminModule/AdminUserPage/',
    // *************************************************

    urlPageConfigUser:          '/_AdminModule/AddEditUserPage/',
    urlPageAddEditUser:         '/_AdminModule/AddEditUserPage/',
    urlPageListUsers:           '/_AdminModule/AdminListUserPage/',
    urlPageAddBUser:            '/_AdminModule/AddBusinessUserPage/',
    urlPageAddRUser:            '/_AdminModule/AddRoleUserPage/',
    urlPageListBusiness:        '/_AdminModule/AdminListBusinessPage/',
    urlPageListModule:          '/_AdminModule/AdminListModulePage/',
    urlPageListBusinessModule:  '/_AdminModule/AdminListModuleBusinessPage/',
    urlPageListRole:            '/_AdminModule/AdminListRolePage/',
    urlPageAddModuleRol:        '/_AdminModule/AddModuleRolePage/'
};

export const httpLandingIndexPage = {

    // -- >> Home Page Index Application
    homeHTTP: '/',

    // -- >> Langing Pages Index Application
    indexHTTP: '/_/index.html',
    
    // -- >> Langing No Login Application
    indexHTTPPendingUser: '/_/PendingPage/index.html',
    indexHTTPNotRolUser: '/_/NotRolPage/index.html',
    // Usuario Inactivo
    indexHTTPInactiveUser: '/_/InactiveUserPage/index.html',
    
    indexHTTPInactiveRolUser: '/_/InactiveRolPage/index.html',
    urlPageNotBusiness: '/_/NotBusinessPage/index.html'
};

// export const Procedimientos = {

//     // ---------------------
//     // PROCEDIMIENTOS DE MODULOS DE GENERALES
//     _MOD_GENERALES: 'GENERALES',
//     _actualizarInformacionCompania: 'ActualizarInformacionCompania'
// };