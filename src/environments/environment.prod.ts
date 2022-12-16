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
    activosfijosbasehref:   '/modulo-activos-fijos/',

    Identif_Bancos:         'ID-BANKAP-BANCOS',
    bancosbasehref:         '/modulo-bancos/',

    Identif_Contabilidad:   'ID-BANKAP-CONTA',
    contabilidadbasehref:   '/modulo-contabilidad/',

    Identif_CuentasCobrar:  'ID-BANKAP-CXC',
    cuentascobrarbasehref:  '/modulo-cuentas-cobrar/',

    Identif_CuentasPagar:   'ID-BANKAP-CXP',
    cuentaspagarbasehref:   '/modulo-cuentas-pagar/',

    Identif_Facturacion:    'ID-BANKAP-FACTURA-E',
    facturacionbasehref:    '/modulo-facturacion/',

    Identif_Generales:      'ID-BANKAP-GENERAL',
    generalesbasehref:      '/modulo-generales/',

    Identif_Inventario:     'ID-BANKAP-INVENTARIO',
    inventariobasehref:     '/modulo-inventario/',

    Identif_Cumplimiento:   'ID-BANKAP-CUMPLIMIENTO',
    cumplimientobasehref:   '/modulo-cumplimiento/',

    Identif_Macred:         'ID-BANKAP-MACRED',
    macredbasehref:         '/modulo-macred/'

};