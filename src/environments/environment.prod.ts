// ## ** enviroment producción ** ## //

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
