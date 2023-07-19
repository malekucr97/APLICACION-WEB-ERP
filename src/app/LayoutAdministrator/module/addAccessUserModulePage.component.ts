import { FormBuilder, FormGroup, Validators  }      from '@angular/forms';
import { Component, OnInit, ViewChild }             from '@angular/core';
import { AccountService, AlertService }             from '@app/_services';
import { MatSidenav }                               from '@angular/material/sidenav';

import { User, Module, Compania, ScreenAccessUser } from '@app/_models';

import { MatDialog }                                from '@angular/material/dialog';
import { DialogoConfirmacionComponent }             from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';

import { first } from 'rxjs/operators';
import { ScreenModule } from '@app/_models/admin/screenModule';
import { ActivatedRoute } from '@angular/router';
import { httpAccessAdminPage } from '@environments/environment-access-admin';
import { administrator } from '@environments/environment';

declare var $: any;

@Component({
    templateUrl: 'HTML_AddAccessUserModulePage.html',
    styleUrls: ['../../../assets/scss/app.scss', '../../../assets/scss/administrator/app.scss']
})
export class AddAccessUserModuleComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'HTML_AddAccessUserModulePage.html';
    public nombreModulo     : string ;

    URLListIndexModules: string = httpAccessAdminPage.urlPageListModule;

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private companiaObservable  : Compania;

    // ## -- formularios -- ## //
    formPantallasModulo : FormGroup;

    // ## -- submit formularios -- ## //
    submittedPantallasModuloForm : boolean = false;

    // ## -- habilita botones -- ## //
    habilitaBtnRegistro     : boolean = true;
    habilitaBtnActualiza    : boolean = false;
    habilitaBtnNuevo        : boolean = false;
    habilitaBtnElimibar     : boolean = false;

    // ## -- habilita grids -- ## //
    screenSelected                      : boolean = false;
    habilitaPantallaModulo              : boolean = false;
    habilitaListasPantallas             : boolean = false;
    habilitaListasUsuarioCompania       : boolean = false;
    habilitaListaUsuariosAccesoPantalla : boolean = false;

    // ## -- listas analisis -- ## //
    public listPantallasModulos : ScreenModule[]  = [];
    public listUsuariosCompania : User[] = [];
    public listUsuariosCompaniaPantalla: User[] = [];

    public moduleScreen : Module = new Module(0,'','','','','','','');
    public moduleItemList : Module;

    public today : Date ;

    constructor (   private route:          ActivatedRoute,
                    private alertService:   AlertService,
                    private formBuilder:    FormBuilder,
                    private accountService: AccountService,
                    private dialogo:        MatDialog ) {

        this.userObservable     = this.accountService.userValue;
        this.companiaObservable = this.accountService.businessValue;

        this.today = new Date();
    }

    get m () {   return this.formPantallasModulo.controls;  }

    ngOnInit() {

        if (this.route.snapshot.params.pidModule) {

            this.nombreModulo   = 'Módulo de Administración / '
                                + 'Administración de Pantallas por Módulo y Accesos de Pantallas por Usuario';

            let moduleId  = this.route.snapshot.params.pidModule;

            this.formPantallasModulo    = this.formBuilder.group({
                idPantalla          : [null],
                codigoPantalla      : [null],
                nombrePantalla      : [null],
                estadoPantalla      : [true],
                urlExterna          : [null]
            });

            this.buscarModuloId(+moduleId);

            this.buscarUsuariosCompania();

            this.buscarPantallasModulo(+moduleId);
        }
    }

    buscarModuloId(moduleId : number = 0) : void {
        this.accountService.getModuleId(moduleId)
            .pipe(first())
            .subscribe(response => {

                if (this.moduleScreen.descripcion=='') this.moduleScreen = response ;

                this.moduleItemList = response;
            });
    }
    buscarUsuariosCompania() : void {

        this.alertService.clear();

        this.accountService.getUsersBusiness(this.userObservable.empresa)
            .pipe(first())
            .subscribe(response => {

                if (response && response.length > 0 && this.listPantallasModulos.length > 0) {

                    this.habilitaListasUsuarioCompania = true;

                    this.listUsuariosCompania = response.filter(x=>x.idRol != administrator.identification && x.idRol != administrator.adminSociedad );

                } else { this.habilitaListasUsuarioCompania = false; }

            }, error => { this.alertService.error('Problemas de conexión . ' + error); });
    }

    buscarPantallasModulo(idModuleSelected : number = 0) : void {

        this.alertService.clear();
        this.submittedPantallasModuloForm = true;

        if (idModuleSelected === 0) {

            let nombrePantalla = this.formPantallasModulo.controls['nombrePantalla'].value ;

            if (!nombrePantalla) nombrePantalla = "%%" ;

            this.accountService.getPantallasNombre(nombrePantalla, this.companiaObservable.id, false)
                .pipe(first())
                .subscribe(response => {

                    if ( response && response.length > 0 ) {

                        this.habilitaListasPantallas        = true;

                        if(this.listUsuariosCompania.length > 0) this.habilitaListasUsuarioCompania  = true;

                        this.listPantallasModulos = response ;

                        this.buscarModuloId(response[0].idModulo);

                        this.selectPantallaModulo(response[0]);

                    } else {

                        this.habilitaListasPantallas        = false;

                        if(this.listUsuariosCompania.length > 0) this.habilitaListasUsuarioCompania  = true;

                        this.inicializaFormPantallaModulo();
                    }
                }, error => { this.alertService.error('Problemas de conexión: ' + error); });

        } else  {

            this.accountService.getPantallasModulo(idModuleSelected, this.companiaObservable.id, true)
            .pipe(first())
            .subscribe(response => {

                if ( response && response.length > 0 ) {

                    this.habilitaListasPantallas        = true;

                    if(this.listUsuariosCompania.length > 0) this.habilitaListasUsuarioCompania  = true;

                    this.listPantallasModulos = response ;

                    this.selectPantallaModulo(response[0]);

                } else {

                    this.habilitaListasPantallas        = false;

                    if(this.listUsuariosCompania.length > 0) this.habilitaListasUsuarioCompania  = true;

                    this.inicializaFormPantallaModulo();

                }
            }, error => { this.alertService.error('Problemas de conexión: ' + error); });
        }
    }

    consultaUsuariosAccesoPantalla(objetoPantalla: ScreenModule) : void {

        this.accountService.getUsersBusinessScreenModule(objetoPantalla.id, this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => {

                if ( response && response.length > 0 ) {

                    this.habilitaListaUsuariosAccesoPantalla = true ;

                    this.listUsuariosCompaniaPantalla = response ;

                } else { this.habilitaListaUsuariosAccesoPantalla = false ; }
            });
    }

    selectPantallaModulo(objeto : ScreenModule) : void {

        this.inicializaFormPantallaModulo(objeto);
        this.consultaUsuariosAccesoPantalla(objeto);
    }

    crearPantallaAccesoUsuarioObject(idUsuario : number, idPantalla : number) : ScreenAccessUser {

        var pantallaAccesUser : ScreenAccessUser = new ScreenAccessUser (this.companiaObservable.id, idUsuario, idPantalla, true) ;

        return pantallaAccesUser ;
    }

    removeUserAccessScreen(objeto : User) : void {

        this.alertService.clear();

        if (this.screenSelected) {

            var pantallaId          : number = this.formPantallasModulo.controls['idPantalla'].value;
            var userAccessScreen    : ScreenAccessUser = this.crearPantallaAccesoUsuarioObject(objeto.id, pantallaId);

            this.accountService.deleteAccesoPantallaUsuario( userAccessScreen.idUsuario, userAccessScreen.idPantalla, userAccessScreen.idCompania )
                .pipe(first())
                .subscribe(response => {
                    if (response.exito) {

                        this.listUsuariosCompaniaPantalla.splice(this.listUsuariosCompaniaPantalla.findIndex( m => m.id == objeto.id ), 1);

                        if (this.listUsuariosCompaniaPantalla.length===0) this.habilitaListaUsuariosAccesoPantalla = false ;

                        this.alertService.success(response.responseMesagge);

                    } else { this.alertService.error(response.responseMesagge); }
                });
        }
    }

    addUserAccessScreen(objeto : User) : void {

        this.alertService.clear();

        let existeUsuarioAcceso : boolean = false ;

        if (this.listUsuariosCompaniaPantalla.length > 0) {

            if (this.listUsuariosCompaniaPantalla.find( m => m.id == objeto.id )) existeUsuarioAcceso = true;
        }

        if (this.screenSelected && !existeUsuarioAcceso) {

            var pantallaNombre : number = this.formPantallasModulo.controls['nombrePantalla'].value;

            var pantallaId : number = this.formPantallasModulo.controls['idPantalla'].value;
            var screenAccessUserObject : ScreenAccessUser = this.crearPantallaAccesoUsuarioObject(objeto.id, pantallaId);

            screenAccessUserObject.adicionadoPor    = this.userObservable.identificacion;
            screenAccessUserObject.fechaAdicion     = this.today;

            this.accountService.postPantallaAccesoUsuario(screenAccessUserObject)
                .pipe(first())
                .subscribe(response => {

                    if ( response ) {

                        if(!this.habilitaListaUsuariosAccesoPantalla) this.habilitaListaUsuariosAccesoPantalla = true;

                        this.listUsuariosCompaniaPantalla.push(objeto);

                        this.alertService.success( `Acceso a pantalla ${pantallaNombre} registrado con éxito.` );

                    } else { this.alertService.error(`No fue posible asignar el acceso a la pantalla .`); }

                }, error => { this.alertService.error( `Problemas al establecer la conexión con el servidor. Detalle: ${ error }` ); });

        } else {  this.alertService.info( `Parece que este usuario ya fue asignado .` ); }
    }

    inicializaFormPantallaModulo(objetoPantalla : ScreenModule = null) : void {

        if (objetoPantalla) {

            this.screenSelected = true;

            this.habilitaBtnRegistro    = false;
            this.habilitaBtnActualiza   = true ;
            this.habilitaBtnNuevo       = true ;
            this.habilitaBtnElimibar    = true ;

            this.formPantallasModulo    = this.formBuilder.group({
                idPantalla      : [objetoPantalla.id],
                codigoPantalla  : [objetoPantalla.codigo,   Validators.required],
                nombrePantalla  : [objetoPantalla.nombre,   Validators.required],
                estadoPantalla  : [objetoPantalla.estado,   Validators.required],
                urlExterna      : [objetoPantalla.urlExterna]
            });

            this.buscarModuloId(objetoPantalla.idModulo);

        } else {

            this.habilitaBtnRegistro    = true ;
            this.habilitaBtnActualiza   = false;
            this.habilitaBtnNuevo       = false;
            this.habilitaBtnElimibar    = false;

            this.formPantallasModulo    = this.formBuilder.group({
                idPantalla      : [null],
                codigoPantalla  : [null,    Validators.required],
                nombrePantalla  : [null,    Validators.required],
                estadoPantalla  : [true,    Validators.required],
                urlExterna      : [null]
            });
        }
    }

    crearPantallaObjectForm() : ScreenModule {

        var codigoPantalla  = this.formPantallasModulo.controls['codigoPantalla'].value;
        var nombrePantalla  = this.formPantallasModulo.controls['nombrePantalla'].value;
        var estadoPantalla  = this.formPantallasModulo.controls['estadoPantalla'].value;
        var urlExterna      = this.formPantallasModulo.controls['urlExterna'].value;

        var pantallaForm = new ScreenModule (this.companiaObservable.id, this.moduleItemList.id, codigoPantalla, nombrePantalla, estadoPantalla, urlExterna);

        return pantallaForm ;
    }

    submitPantallaModulo() : void {

        this.alertService.clear();
        this.submittedPantallasModuloForm = true;

        if ( this.formPantallasModulo.invalid ) return;

        var pantallaModuloForm : ScreenModule = this.crearPantallaObjectForm();

        pantallaModuloForm.adicionadoPor    = this.userObservable.identificacion;
        pantallaModuloForm.fechaAdicion     = this.today;

        this.accountService.postPantallaModulo(pantallaModuloForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    this.habilitaListasPantallas = true;

                    if(this.listUsuariosCompania.length > 0) this.habilitaListasUsuarioCompania  = true;

                    this.listPantallasModulos.push(response);

                    this.inicializaFormPantallaModulo();

                    this.alertService.success( `Pantalla ${response.nombre} registrada con éxito.` );

                } else { this.alertService.error(`No fue posible registrar la pantalla .`); }

            }, error => { this.alertService.error( `Problemas al establecer la conexión con el servidor. Detalle: ${ error }` ); });
    }

    eliminarPantallaModulo() : void {

        this.alertService.clear();
        this.submittedPantallasModuloForm = true;

        if ( this.formPantallasModulo.invalid ) return;

        var id : number = this.formPantallasModulo.controls['idPantalla'].value;

        this.dialogo.open(DialogoConfirmacionComponent, { data: `Segur@ que desea eliminar el registro para siempre ?` })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {

                if (confirmado) {

                    this.accountService.deletePantallaModulo( id )
                        .pipe(first())
                        .subscribe(response => {
                            if (response.exito) {

                                this.listPantallasModulos.splice(this.listPantallasModulos.findIndex( m => m.id == id ), 1);

                                if (this.listPantallasModulos.length === 0) {
                                    this.habilitaListasPantallas        = false;
                                    this.habilitaListasUsuarioCompania  = false;
                                }

                                this.inicializaFormPantallaModulo();

                                this.alertService.success(response.responseMesagge);

                            } else { this.alertService.error(response.responseMesagge); }
                        });
                } else { return; }
            });
    }

    limpiarFormularioPantallaModulo() : void { this.inicializaFormPantallaModulo(); }

    actualizaPantallaModulo() : void {

        this.alertService.clear();
        this.submittedPantallasModuloForm = true;

        if ( this.formPantallasModulo.invalid ) return;

        var pantallaModuloForm : ScreenModule = this.crearPantallaObjectForm();

        pantallaModuloForm.id = this.formPantallasModulo.controls['idPantalla'].value;

        pantallaModuloForm.modificadoPor        = this.userObservable.identificacion;
        pantallaModuloForm.fechaModificacion    = this.today;

        this.accountService.putPantallaModulo(pantallaModuloForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    if( this.listPantallasModulos.find( m => m.id == response.id ) ) {
                        this.listPantallasModulos.splice(this.listPantallasModulos.findIndex( m => m.id == response.id ), 1);
                    }
                    this.listPantallasModulos.push(response);

                    this.inicializaFormPantallaModulo();

                    this.alertService.success( `Pantalla ${response.nombre} actualizada con éxito.` );

                } else { this.alertService.error(`No fue posible actualizar el registro .`); }

            }, error => { this.alertService.error( `Problemas al establecer la conexión con el servidor. Detalle: ${ error }` ); });
    }
}
