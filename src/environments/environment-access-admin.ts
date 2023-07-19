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

// export const httpHomeModulesPage = {
//     // *************************************************
//     // -- >> Home Módulos *******
//     // *************************************************
//     urlHomeModuleGenerales:          '/inra-sa/modulo-generales/index.html'
// };