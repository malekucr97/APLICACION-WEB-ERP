// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiUrl: 'http://localhost:4000'
};

// export const httpAccessPage = {
//     // -- >> Langing Pages Index Application
//     urlContentIndex: '/_/index.html',
    
//     // -- >> Langing No Login Application
//     urlPagePending: '/_/PendingPage/index.html',
//     urlPageNotRol: '/_/NotRolPage/index.html',
//     // Usuario Inactivo
//     urlPageInactiveUser: '/_/InactiveUserPage/index.html',
    
//     urlPageInactiveRol: '/_/InactiveRolPage/index.html',
//     urlPageNotBusiness: '/_/NotBusinessPage/index.html'
// };

export const localVariables = {
    dir_img_modules: '/assets/images/inra/ModulosBankap/'
};

export const ModulesSystem = {
    Identif_ActivosFijos: 'ID-BANKAP-ACT-FIJ',
    ActivosFijosIndexURL: '/_ActivosFijosModule/Index.html',

    Identif_Bancos: 'ID-BANKAP-BANCOS',
    BancosIndexURL: '/_BancosModule/Index.html',

    Identif_Contabilidad: 'ID-BANKAP-CONTA',
    ContabilidadIndexURL: '/_ContabilidadModule/Index.html',

    Identif_CuentasCobrar: 'ID-BANKAP-CXC',
    CuentasCobrarIndexURL: '/_CuentasCobrarModule/Index.html',

    Identif_CuentasPagar: 'ID-BANKAP-CXP',
    CuentasPagarIndexURL: '/_CuentasPagarModule/Index.html',

    Identif_Facturacion: 'ID-BANKAP-FACTURA-E',
    FacturacionIndexURL: '/_FacturacionModule/Index.html',

    Identif_Generales: 'ID-BANKAP-GENERAL',
    GeneralesIndexURL: '/_GeneralesModule/Index.html',

    Identif_Inventario: 'ID-BANKAP-INVENTARIO',
    InventarioIndexURL: '/_InventarioModule/Index.html',

    Identif_Cumplimiento: 'ID-BANKAP-CUMPLIMIENTO',
    CumplimientoIndexURL: '/_ModuloCumplimiento/Index.html',

    Identif_Macred: 'ID-BANKAP-MACRED',
    MacredIndexURL: '/_ModuloMacred/Index.html'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
