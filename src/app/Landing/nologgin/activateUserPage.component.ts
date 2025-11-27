import { Component } from '@angular/core';
import { AccountService } from '@app/_services';
import { User } from '@app/_models';
import { Router, UrlTree } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-activate-user-page',
    templateUrl: 'HTML_ActivateUserPage.html',
    styleUrls: ['../../../assets/scss/landing/app.scss'],
    standalone: false
})
export class ActivateUserPageComponent {
  user = new User();
  private urlTree: UrlTree;

  private _tokenUser: string;
  public get tokenUser(): string { return this._tokenUser; }
  public set tokenUser(v: string) { this._tokenUser = v; }

  private _identificacionUser: string;
  public get identificacionUser(): string { return this._identificacionUser; }
  public set identificacionUser(v: string) { this._identificacionUser = v; }

  private _cargandoActivacion: boolean = true;
  public get cargandoActivacion(): boolean { return this._cargandoActivacion; }
  public set cargandoActivacion(v: boolean) { this._cargandoActivacion = v; }

  private _mensajeUsuario: string = '';
  public get mensajeUsuario(): string { return this._mensajeUsuario; }
  public set mensajeUsuario(v: string) { this._mensajeUsuario = v; }

  constructor(private router: Router, private accountService: AccountService) {
    this.user = this.accountService.userValue;

    this.urlTree = this.router.parseUrl(this.router.url);
    this.tokenUser = this.urlTree.queryParams['tk'];
    this.identificacionUser = this.urlTree.queryParams['ui'];

    this.cargandoActivacion = true;

    this.activarUsuarioPorEmail();
  }

  private activarUsuarioPorEmail() {

    if (!this.tokenUser || !this.identificacionUser) {
        this.mensajeUsuario = 'Los datos indicados no son correctos';
        this.cargandoActivacion = false;
    }

    // SE CARGA LA INFORMACIÓN DEL USUARIO.
    let objUser: User = { identificacion: this.identificacionUser, token: this.tokenUser } as User;

    // SE REALIZA LA CONSULTA AL API.
    this.accountService.activateByEmail(objUser)
      .pipe(first())
      .subscribe((response) => {
        this.mensajeUsuario = response.responseMesagge;
        this.cargandoActivacion = false;
      });
  }

  redirect() { this.accountService.logotWithoutApiCall(); }
}
