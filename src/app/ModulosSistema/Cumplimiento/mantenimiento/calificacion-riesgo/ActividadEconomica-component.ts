import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService} from '@app/_services';
import { User, Module } from '@app/_models';
import { first } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '../../../../_models/modules/compania';
import { ActividadEconomica } from '@app/_models/Cumplimiento/ActividadEconomica';
import { CumplimientoService } from '@app/_services/cumplimiento.service';
import { ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
    templateUrl: 'HTML_ActividadEconomica.html',
    styleUrls: ['../../../../../assets/scss/cumplimiento/app.scss'],
})
export class ActividadEconomicaComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;
    
    userObservable: User;
    moduleObservable: Module;
    companiaObservable: Compania;

    showList : boolean = false;
    submitted : boolean = false;
    update: boolean = false;
    add: boolean = false;
    delete: boolean = false;

    buttomText : string = '';

    economicActivityForm: FormGroup;

    listEconomicActivity: ActividadEconomica[];

    // public URLAddEditGroupPage: string = httpModulesPages.urlCumplimiento_Grupo;

    constructor (private formBuilder: FormBuilder,
                 private cumplimientoService: CumplimientoService, 
                 private accountService: AccountService,
                 private alertService: AlertService,
                 private route: ActivatedRoute)
    {
        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.companiaObservable = this.accountService.businessValue;
    }

    ngOnInit() {

        this.economicActivityForm = this.formBuilder.group({
            
            descripcion: [''],
            valorRiesgo: [''],
            estado: ['']
        });

        

        this.cumplimientoService.getEconomicActivityBusiness(this.userObservable.empresa)
            .pipe(first())
            .subscribe(economicActivityResponse => {

                if (economicActivityResponse.length > 0) {
                    this.showList = true;
                    this.listEconomicActivity = economicActivityResponse;
                }
            },
            error => {
                let message : string = 'Problemas al consultar las actividades económicas. ' + error;
                this.alertService.error(message); 
            });
    }

    onAdd() : void {

        this.add = true;
        this.buttomText = 'Registrar';

        this.economicActivityForm = this.formBuilder.group({
            
            descripcion: ['', Validators.required],
            valorRiesgo: ['', Validators.required],
            estado: ['A', Validators.required]
        });

        $('#actividadEconomicaModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onEdit(economicActivity:ActividadEconomica) : void {

        this.update = true;
        this.buttomText = 'Actualizar';

        this.economicActivityForm = this.formBuilder.group({
            descripcion: [economicActivity.descripcion, Validators.required],
            valorRiesgo: [economicActivity.valorRiesgo, Validators.required],
            estado: [economicActivity.estado, Validators.required]
        });

        $('#actividadEconomicaModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onDelete(economicActivity:ActividadEconomica) : void {

        this.delete = true;

        if(confirm("Está seguro que desea eliminar la actividad económica " + economicActivity.descripcion)) {
            console.log("pos si");
        } else {console.log("pos no");}
    }

    get f() { return this.economicActivityForm.controls; }

    onSubmit() : void {

        this.alertService.clear();
        this.submitted = true;

        var today = new Date();

        if (this.economicActivityForm.invalid)
            return;
        
        let economicActivityForm = new ActividadEconomica();

        economicActivityForm.codigoCompania = this.companiaObservable.id;
        economicActivityForm.descripcion = this.economicActivityForm.get('descripcion').value;
        economicActivityForm.valorRiesgo = this.economicActivityForm.get('valorRiesgo').value;
        economicActivityForm.estado = this.economicActivityForm.get('estado').value;

        if (this.add) {
            economicActivityForm.adicionadoPor = this.userObservable.identificacion;
            economicActivityForm.fechaAdicion = today;
 
            // procedure add
        }
        
        if (this.update) {
            economicActivityForm.modificadoPor = this.userObservable.identificacion;
            economicActivityForm.fechaModificacion = today;

            // this.cumplimientoService.update(riskForm)
            //     .pipe(first())
            //     .subscribe( responseUpdate => {

            //         if (responseUpdate.exito) {
            //             this.alertService.success(responseUpdate.responseMesagge);
            //         } else {
            //             this.alertService.error(responseUpdate.responseMesagge);
            //         }
            //         $('#nivelRiesgoModal').modal('hide');
            //     },
            //     error => {
            //         let messaje : string = 'Problemas al actualizar la información del nivel de riesgo. ' + error;
            //         this.alertService.error(messaje);
            //     });
        }

        
    }
}