import { Component } from '@angular/core';
import { AccountService } from './_services';
import { Location } from '@angular/common';
import { User } from './_models';
import { first } from 'rxjs/operators';
import { GenTipoCambio } from './_models/Generales/TipoCambio';

@Component({selector: 'app',
            templateUrl: 'app.component.html',
            styleUrls: ['../assets/scss/app.scss'],
})
export class AppComponent {
  user: User;

  public tc : boolean = false;

  public vcompra : string = 'no value';
  public vventa : string = 'no value';

  constructor (private accountService: AccountService,
              private location: Location) {
    this.accountService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    
    window.addEventListener('popstate', () => { 
      window.history.replaceState(null, '', '/');
      this.location.forward(); 

      // if( this.accountService.userValue != null && this.accountService.businessValue != null ) 
      // this.getTipoCambioUS();
    });
  }

  // inicializaFormularioTipoCambio(objeto : GenTipoCambio) : void {
  //   this.vcompra = objeto.montoCompra.toString();
  //   this.vventa = objeto.montoVenta.toString();

  //   this.tc = true;
  // }
  // getTipoCambioUS():void{
  //   let fechaConsultaCompleta : string = this.obtieneFechaConsultaWebServiceTipoCambio();

  //   this.accountService.requestTipoCambioBCCR(317, 318, 2, 1, fechaConsultaCompleta)
  //     .pipe(first())
  //     .subscribe(responseTiposCambioBCCR => {

  //         if ( responseTiposCambioBCCR ) {
  //             this.inicializaFormularioTipoCambio(responseTiposCambioBCCR);
  //         }
  //     });
  // }

  // obtieneFechaConsultaWebServiceTipoCambio() : string {

  //   let myDate = new Date();

  //   // if (!this.formTipoCambio.controls['fechaConsulta'].value) return "%%" ;
  //   // let fechaConsulta = new Date(this.formTipoCambio.controls['fechaConsulta'].value);
  //   // let fechaConsulta = this.datePipe.transform(myDate, 'yyyy-MM-dd');

  //   let date    = myDate.getDate();
  //   let month   = myDate.getMonth() + 1;
  //   let year    = myDate.getFullYear();

  //   let dia     : string = "" ;
  //   let mes     : string = "" ;
  //   let anio    : string = year.toString() ;

  //   dia = date.toString();
  //   if (date < 10) dia = '0' + date.toString();
      
  //   mes = month.toString();
  //   if (month < 10) mes = '0' + month.toString();
    
  //   let fechaConsultaCompleta : string = dia + '/' + mes + '/' + anio ;

  //   return fechaConsultaCompleta ;
  // }
}
