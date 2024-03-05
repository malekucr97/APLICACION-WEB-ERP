import { FormBuilder, FormGroup, Validators  }      from '@angular/forms';
import { Component, OnInit, ViewChild }             from '@angular/core';
import { AccountService, AlertService }             from '@app/_services';
import { MatSidenav }                               from '@angular/material/sidenav';
import { User, Module, Compania, ScreenAccessUser } from '@app/_models';
import { MatDialog }                                from '@angular/material/dialog';
import { DialogoConfirmacionComponent }             from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';
import { first } from 'rxjs/operators';
import { ScreenModule } from '@app/_models/admin/screenModule';
import { ActivatedRoute, Router } from '@angular/router';
import { administrator, httpAccessAdminPage } from '@environments/environment';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
    templateUrl: 'HTML_AddAccessUserModulePage.html',
    styleUrls: ['../../../assets/scss/app.scss', '../../../assets/scss/administrator/app.scss']
})
export class AddAccessUserModuleComponent extends OnSeguridad implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'HTML_AddAccessUserModulePage.html';

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

    pidModuleParam : number ;

    public today : Date = new Date();

    constructor (   private route:          ActivatedRoute,
                    private alertService:   AlertService,
                    private formBuilder:    FormBuilder,
                    private accountService: AccountService,
                    private dialogo:        MatDialog,
                    private router:         Router,
                    private translate: TranslateService ) {

        super(alertService, accountService, router);

        // ***************************************************************
        // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
        if (!super.userAuthenticateAdmin() ||
            !this.route.snapshot.params.pidModule) { this.accountService.logout(); return; }
        // ***************************************************************

        this.userObservable     = this.accountService.userValue;
        this.companiaObservable = this.accountService.businessValue;

        this.inicializaFormularioPantalla();

        this.pidModuleParam = this.route.snapshot.params.pidModule;

        this.buscarModuloId(this.pidModuleParam);
        this.buscarUsuariosCompania();
    }
    
    get m () {   return this.formPantallasModulo.controls;  }

    ngOnInit() { this.buscarPantallasModulo(this.pidModuleParam); }

    nuevoRegistroPantalla() : void { 

        this.inicializaFormPantallaModulo(); 

        this.habilitaListasUsuarioCompania = false;
        this.habilitaListaUsuariosAccesoPantalla = false;
    }
    selectPantallaModulo(objeto : ScreenModule) : void {

        this.habilitaListasUsuarioCompania = true;
        this.habilitaListaUsuariosAccesoPantalla = true;

        this.inicializaFormPantallaModulo(objeto);
        this.consultaUsuariosAccesoPantalla(objeto);
    }

    private inicializaFormularioPantalla() : void {
        this.formPantallasModulo    = this.formBuilder.group({
            idPantalla          : [null],
            codigoPantalla      : [null],
            nombrePantalla      : [null],
            estadoPantalla      : [true],
            urlExterna          : [null]
        });
    }
    private inicializaFormPantallaModulo(objetoPantalla : ScreenModule = null) : void {

        if (objetoPantalla) {

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
    private crearPantallaObjectForm() : ScreenModule {

        var codigoPantalla  = this.formPantallasModulo.controls['codigoPantalla'].value;
        var nombrePantalla  = this.formPantallasModulo.controls['nombrePantalla'].value;
        var estadoPantalla  = this.formPantallasModulo.controls['estadoPantalla'].value;
        var urlExterna      = this.formPantallasModulo.controls['urlExterna'].value;

        var pantallaForm = new ScreenModule (this.companiaObservable.id, this.moduleItemList.id, codigoPantalla, nombrePantalla, estadoPantalla, urlExterna);

        return pantallaForm ;
    }

    buscarModuloId(moduleId : number) : void {
        this.accountService.getModuleId(moduleId, this._HIdUserSessionRequest, this._HBusinessSessionRequest)
            .pipe(first())
            .subscribe(response => {

                if (this.moduleScreen.id===0) this.moduleScreen = response ;

                this.moduleItemList = response;
            });
    }

    private buscarUsuariosCompania() : void {

        this.alertService.clear();

        this.accountService.getUsersBusiness(this.userObservable.empresa, this._HIdUserSessionRequest, this._HBusinessSessionRequest)
            .pipe(first())
            .subscribe(response => {

                if (response && response.length > 0) {

                    if (this.habilitaListasPantallas) this.habilitaListasUsuarioCompania = true;

                    this.listUsuariosCompania = response.filter(x=>x.idRol != administrator.identification && x.idRol != administrator.adminSociedad );
                    if (this.listUsuariosCompania.length === 0) this.habilitaListasUsuarioCompania = false;

                } else { this.habilitaListasUsuarioCompania = false; }

            }, error => { this.alertService.error(this.translate.instant('ALERTS.CONNECTION_ERROR', {ERROR: error})); });
    }
    private consultaUsuariosAccesoPantalla(objetoPantalla: ScreenModule) : void {

        this.listUsuariosCompaniaPantalla = [];

        this.accountService.getUsersBusinessScreenModule(objetoPantalla.id,this.companiaObservable.id,false,this._HIdUserSessionRequest, 
                                                                                                            this._HBusinessSessionRequest)
            .pipe(first())
            .subscribe(response => {

                if ( response && response.length > 0 ) {

                    this.habilitaListaUsuariosAccesoPantalla = true;
                    this.habilitaListasUsuarioCompania = true;

                    this.listUsuariosCompaniaPantalla = response;

                } else { this.habilitaListaUsuariosAccesoPantalla = false; }
            });
    }

    buscarPantallasModulo(idModuleSelected : number = 0) : void {

        this.alertService.clear();
        this.submittedPantallasModuloForm = true;

        if (idModuleSelected === 0) {

            let nombrePantalla = this.formPantallasModulo.controls['nombrePantalla'].value ;

            if (!nombrePantalla) nombrePantalla = "%%" ;

            this.accountService.getPantallasNombre(nombrePantalla,this.companiaObservable.id,false, this._HIdUserSessionRequest,
                                                                                                    this._HBusinessSessionRequest)
                .pipe(first())
                .subscribe(response => {

                    if ( response && response.length > 0 ) {

                        this.habilitaListasPantallas = true;
                        this.listPantallasModulos = response ;
                        this.selectPantallaModulo(response[0]);

                        this.buscarModuloId(response[0].idModulo);

                    } else {

                        this.habilitaListasPantallas = false;
                        this.habilitaListasUsuarioCompania = false;

                        this.inicializaFormPantallaModulo();
                    }
                }, error => { this.alertService.error(this.translate.instant('ALERTS.CONNECTION_ERROR', {ERROR: error})); });

        } else {

            this.accountService.getPantallasModulo(idModuleSelected,this.companiaObservable.id,true,this._HIdUserSessionRequest,
                                                                                                    this._HBusinessSessionRequest)
            .pipe(first())
            .subscribe(response => {

                if ( response && response.length > 0 ) {

                    this.habilitaListasPantallas = true;
                    this.listPantallasModulos = response;
                    this.selectPantallaModulo(response[0]);

                } else {

                    this.habilitaListasPantallas = false;
                    this.habilitaListasUsuarioCompania = false;

                    this.inicializaFormPantallaModulo();
                }
            }, error => { this.alertService.error(this.translate.instant('ALERTS.CONNECTION_ERROR', {ERROR: error})); });
        }
    }

    crearPantallaAccesoUsuarioObject(idUsuario : number, idPantalla : number) : ScreenAccessUser {
        var pantallaAccesUser : ScreenAccessUser = new ScreenAccessUser (   this.companiaObservable.id, 
                                                                            idUsuario,
                                                                            idPantalla, 
                                                                            true) ;
        return pantallaAccesUser;
    }

    removeUserAccessScreen(objeto : User) : void {

        this.alertService.clear();

        var pantallaId : number = this.formPantallasModulo.controls['idPantalla'].value;
        var screenObject : ScreenAccessUser = this.crearPantallaAccesoUsuarioObject(objeto.id, pantallaId);

        this.accountService.deleteAccesoPantallaUsuario( screenObject.idUsuario,screenObject.idPantalla,screenObject.idCompania,this._HIdUserSessionRequest,
                                                                                                                                this._HBusinessSessionRequest )
            .pipe(first())
            .subscribe(response => {

                if (response.exito) {

                    this.listUsuariosCompaniaPantalla.splice(this.listUsuariosCompaniaPantalla.findIndex( m => m.id == objeto.id ), 1);

                    if (this.listUsuariosCompaniaPantalla.length===0) this.habilitaListaUsuariosAccesoPantalla = false ;

                    this.alertService.success(response.responseMesagge);

                } else { this.alertService.error(response.responseMesagge); }
            });
    }

    addUserAccessScreen(objeto : User) : void {

        this.alertService.clear();

        let existeUsuarioAcceso : boolean = false ;

        if (this.listUsuariosCompaniaPantalla && this.listUsuariosCompaniaPantalla.length > 0) {
            if (this.listUsuariosCompaniaPantalla.find( m => m.id == objeto.id )) existeUsuarioAcceso = true;
        }

        if (!existeUsuarioAcceso) {

            var pantallaId : number = this.formPantallasModulo.controls['idPantalla'].value;

            var screenAccessUserObject : ScreenAccessUser = this.crearPantallaAccesoUsuarioObject(objeto.id, pantallaId);

            screenAccessUserObject.adicionadoPor = this.userObservable.identificacion;
            screenAccessUserObject.fechaAdicion = this.today;

            this.accountService.postPantallaAccesoUsuario(screenAccessUserObject, this._HIdUserSessionRequest, this._HBusinessSessionRequest)
                .pipe(first())
                .subscribe(response => {

                    if ( response.exito ) {

                        if(!this.habilitaListaUsuariosAccesoPantalla) this.habilitaListaUsuariosAccesoPantalla = true;

                        this.listUsuariosCompaniaPantalla.push(objeto);

                        this.alertService.success(response.responseMesagge);

                    } else { this.alertService.error(response.responseMesagge); }
                });
        } else {  this.alertService.info( this.translate.instant('ALERTS.USER_ASSIGNED') ); }
    }

    submitPantallaModulo() : void {

        this.alertService.clear();
        this.submittedPantallasModuloForm = true;

        if ( this.formPantallasModulo.invalid ) return;

        var pantallaModuloForm : ScreenModule = this.crearPantallaObjectForm();

        pantallaModuloForm.adicionadoPor = this.userObservable.identificacion;
        pantallaModuloForm.fechaAdicion = this.today;

        this.accountService.postPantallaModulo(pantallaModuloForm, this._HIdUserSessionRequest, this._HBusinessSessionRequest)
            .pipe(first())
            .subscribe(response => {

                if ( response.exito ) {

                    this.habilitaListasPantallas = true;
                    this.listPantallasModulos.push(response.objetoDb);

                    this.inicializaFormPantallaModulo();

                    this.alertService.success(response.responseMesagge);

                } else { this.alertService.error(response.responseMesagge); }

            }, error => { this.alertService.error(this.translate.instant('ALERTS.CONNECTION_ERROR', {ERROR: error})); });
    }

    eliminarPantallaModulo() : void {

        this.alertService.clear();
        this.submittedPantallasModuloForm = true;

        if ( this.formPantallasModulo.invalid ) return;

        var id : number = this.formPantallasModulo.controls['idPantalla'].value;

        this.dialogo.open(DialogoConfirmacionComponent, { data: this.translate.instant('DIALOGS.DELETE_MODULE_TO_SCREEN') })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {

                if (confirmado) {

                    this.accountService.deletePantallaModulo(id,this._HIdUserSessionRequest, 
                                                                // this._HUserSessionRequest, 
                                                                this._HBusinessSessionRequest)
                        .pipe(first())
                        .subscribe(response => {

                            if (response.exito) {

                                this.habilitaListasUsuarioCompania          = false;
                                this.habilitaListaUsuariosAccesoPantalla    = false;

                                this.listPantallasModulos.splice(this.listPantallasModulos.findIndex( m => m.id == id ), 1);

                                if (this.listPantallasModulos.length === 0) this.habilitaListasPantallas = false;

                                this.inicializaFormPantallaModulo();

                                this.alertService.success(response.responseMesagge);

                            } else { this.alertService.error(response.responseMesagge); }
                        });
                } else { return; }
            });
    }

    actualizaPantallaModulo() : void {

        this.alertService.clear();
        this.submittedPantallasModuloForm = true;

        if ( this.formPantallasModulo.invalid ) return;

        var pantallaModuloForm : ScreenModule = this.crearPantallaObjectForm();

        pantallaModuloForm.id = this.formPantallasModulo.controls['idPantalla'].value;

        pantallaModuloForm.modificadoPor        = this.userObservable.identificacion;
        pantallaModuloForm.fechaModificacion    = this.today;

        this.accountService.putPantallaModulo(pantallaModuloForm, this._HIdUserSessionRequest, this._HBusinessSessionRequest)
            .pipe(first())
            .subscribe(response => {

                if ( response.exito ) {

                    this.habilitaListasUsuarioCompania          = false;
                    this.habilitaListaUsuariosAccesoPantalla    = false;

                    this.listPantallasModulos.splice(this.listPantallasModulos.findIndex( m => m.id == pantallaModuloForm.id ), 1);
                    this.listPantallasModulos.push(response.objetoDb);

                    this.inicializaFormPantallaModulo();

                    this.alertService.success(response.responseMesagge);

                } else { this.alertService.error(response.responseMesagge); }

            }, error => { this.alertService.error(this.translate.instant('ALERTS.CONNECTION_ERROR', {ERROR: error})); });
    }
}
