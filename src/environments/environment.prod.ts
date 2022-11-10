export const environment = {
    production: true,
    apiUrl: 'http://localhost:81'
};

export const administrator = {
    production: true,
    identification: 'adminboss',
    state: 'admin',
    urlRedirect: ''
};

export const register = {
    production: true,
    state: 'Registrado',
    urlRedirect: ''
};

export const pending = {
    production: true,
    state: 'Pendiente',
    urlRedirect: ''
};

export const active = {
    production: true,
    state: 'Activo',
    urlRedirect: ''
};

export const localVariables = {
    dir_img_modules: './assets/images/inra/ModulosBankap/'
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
    MacredIndexURL: '/_MacredModulo/Index.html'
};