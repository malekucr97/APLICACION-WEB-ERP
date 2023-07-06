import { Router } from '@angular/router';
import { Compania, Module, User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { amdinBusiness } from '@environments/environment-access-admin';
import { first } from 'rxjs/operators';

export class OnSeguridad {

  private _alertService: AlertService;
  private _accountService: AccountService;
  private _router: Router;
  private _userObservable: User;
  private _moduleObservable: Module;
  private _businessObservable: Compania;

  _nombrePantalla: string;
  _redireccionURL: string;
  _mensajeError: string = 'El usuario no cuenta con los accesos correspondientes o la pantalla se encuentra inactiva.';

  constructor(
    alertService: AlertService,
    accountService: AccountService,
    router: Router
  ) {
    this._alertService = alertService;
    this._accountService = accountService;
    this._router = router;
    this._userObservable = accountService.userValue;
    this._moduleObservable = accountService.moduleValue;
    this._businessObservable = accountService.businessValue;
    this._redireccionURL = this._moduleObservable?.indexHTTP && '';
  }

  validarAccesoPantalla(): void {
    this._accountService
      .validateAccessUser(
        this._userObservable.id,
        this._moduleObservable.id,
        this._nombrePantalla,
        this._businessObservable.id
      )
      .pipe(first())
      .subscribe((response) => {
        if (!response.exito) {
          this._router.navigate([this._redireccionURL]);
          this._alertService.error(this._mensajeError);
        }
      });
  }

  validarUsuarioAdmin(): boolean {
    if (this._userObservable.esAdmin) return true;
    if (this._userObservable.idRol == amdinBusiness.adminSociedad) return true;
    return false;
  }
}
