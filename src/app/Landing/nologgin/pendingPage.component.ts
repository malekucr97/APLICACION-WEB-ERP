import { Component } from '@angular/core';
import { AccountService } from '@app/_services';
import { User } from '@app/_models';
import { first } from 'rxjs/operators';

@Component({
  templateUrl: 'HTML_PendingPage.html',
  styleUrls: ['../../../assets/scss/landing/app.scss'],
})
export class PendingUserPageComponent {
  user = new User();


  private _mostrarMensajeReenvio : boolean;
  public get mostrarMensajeReenvio() : boolean {
    return this._mostrarMensajeReenvio;
  }
  public set mostrarMensajeReenvio(v : boolean) {
    this._mostrarMensajeReenvio = v;
  }

  private _mensajeReenvio : string;
  public get mensajeReenvio() : string {
    return this._mensajeReenvio;
  }
  public set mensajeReenvio(v : string) {
    this._mensajeReenvio = v;
  }


  constructor(private accountService: AccountService) {
    this.user = this.accountService.userValue;
  }

  redirect() {
    this.accountService.logout();
  }

  reenviarEmail() {
    this.mostrarMensajeReenvio = false;
    this.accountService.reenviarCorreoActivacion( this.user.identificacion, 'n/a', this.user.id.toString(), this.user.nombreCompleto )
      .pipe(first())
      .subscribe((response) => {
        this.mensajeReenvio = response.responseMesagge;
        this.mostrarMensajeReenvio = true;
      });
  }

}
