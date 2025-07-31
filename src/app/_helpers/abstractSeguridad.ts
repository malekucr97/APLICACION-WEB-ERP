import { Router } from '@angular/router';
import { Compania, Module, User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';
import { administrator } from '@environments/environment';
import { first } from 'rxjs/operators';

export class OnSeguridad {

  private _codeSuccessUser : string = '202';

  public _passwordPattern : string ;
  public _userPattern : string ;
  public _emailPattern : string ;

  private _router: Router;
  private _alertService: AlertService;
  private _accountService: AccountService;
  private _userObservable: User;
  private _moduleObservable: Module;
  private _businessObservable: Compania;

  public _nombrePantalla: string;
  public _redireccionURL: string;
  public _mensajeError: string;

  public _HIdUserSessionRequest : string ;
  public _HUserSessionRequest : string ;
  public _HBusinessSessionRequest : string ;
  public _HModuleSessionRequest : string ;

  constructor(alertService: AlertService, 
              accountService: AccountService, 
              router: Router,
              translateMessagesService: TranslateMessagesService) {

    this._alertService = alertService;
    this._accountService = accountService;
    this._router = router;
    this._mensajeError = translateMessagesService.translateKey('ALERTS.USER_WITHOUT_ACCESS');

    this._userObservable = accountService.userValue;
    this._moduleObservable = accountService.moduleValue;
    this._businessObservable = accountService.businessValue;
    this._redireccionURL = this._moduleObservable?.indexHTTP && '';

    this._HIdUserSessionRequest = this._userObservable ? this._userObservable.id.toString() : '';
    this._HUserSessionRequest = this._userObservable ? this._userObservable.nombreCompleto : '';
    this._HBusinessSessionRequest = this._businessObservable ? this._businessObservable.id.toString() : '';
    this._HModuleSessionRequest = this._moduleObservable ? this._moduleObservable.id.toString() : '';

    this._userPattern = "^[a-zA-Z0-9]{5,15}$";
    this._passwordPattern = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{5,12}$";
    this._emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  }

  validarAccesoPantalla() {

    this._accountService.validateAccessUser(  this._userObservable.id, this._moduleObservable.id, this._nombrePantalla, this._businessObservable.id,
                                              this._HIdUserSessionRequest,
                                              this._HBusinessSessionRequest,
                                              this._HModuleSessionRequest )
      .pipe(first())
      .subscribe((response) => {  if (!response.exito) this.redirectHomeModule(); });
  }
  private redirectHomeModule() { this._router.navigate([this._redireccionURL]); this._alertService.error(this._mensajeError); }

  // **
  // ** VALIDACIÓN DE USUARIO TÉCNICO O ADMINISTRADOR DE EMPRESAS
  validarUsuarioAdmin(): boolean {
    if (this._userObservable.esAdmin || this._userObservable.idRol == administrator.adminSociedad) return true;
    return false;
  }

  // **
  // ** VALIDACIÓN DE USUARIO HTTP CODE
  userAuthenticateAdmin() : boolean {
    if (this._userObservable 
          && this._userObservable.codeNoLogin === this._codeSuccessUser 
          && this.validarUsuarioAdmin() 
          && this._businessObservable) return true;
    return false;
  }
  userAuthenticateHome() : boolean {
    if (this._userObservable 
          && this._userObservable.codeNoLogin === this._codeSuccessUser 
          && this._userObservable.idRol) return true;
    return false;
  }
  userAuthenticateIndexHttp() : boolean {
    if (this._userObservable 
          && this._userObservable.codeNoLogin === this._codeSuccessUser 
          && this._userObservable.idRol 
          && this._businessObservable) return true;

    return false;
  }
  userAuthenticateIndexComponent() : boolean {
    if (this._userObservable 
          && this._userObservable.codeNoLogin === this._codeSuccessUser 
          && this._userObservable.idRol 
          && this._moduleObservable 
          && this._businessObservable) return true;
    return false;
  }
  // **
}
