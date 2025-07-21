import { Component, OnInit } from '@angular/core';
import { MacEscenariosRiesgos } from '@app/_models/Macred';
import { AccountService, AlertService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { SrvDatosAnalisisService } from '../servicios/srv-datos-analisis.service';

@Component({
    selector: 'app-escenariofcl',
    templateUrl: './escenariofcl.component.html',
    styleUrls: [
        '../../../../../assets/scss/app.scss',
        '../../../../../assets/scss/macred/app.scss',
    ],
    standalone: false
})
export class EscenariofclComponent implements OnInit {

  lstEscenariosRiesgo: MacEscenariosRiesgos[] = [];

  constructor(
    private macredService: MacredService,
    private accountService: AccountService,
    private alertService: AlertService,
    public srvDatosAnalisisService: SrvDatosAnalisisService) { }

  ngOnInit(): void {
  }

  // METODOS - FUNCIONES
  private name() {

  }


  // EVENTOS


}
