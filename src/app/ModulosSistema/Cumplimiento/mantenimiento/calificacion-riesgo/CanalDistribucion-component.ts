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
import { httpModulesPages } from '@environments/environment-access-admin';
import { CanalDistribucion } from '@app/_models/Cumplimiento/CanalDistribucion';

declare var $: any;

@Component({
    templateUrl: 'HTML_CanalDistribucion.html',
    styleUrls: ['../../../../../assets/scss/cumplimiento/app.scss'],
})
export class CanalDistribucionComponent implements OnInit {
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

    distributionChannelForm: FormGroup;

    listDistributionChannels: CanalDistribucion[];

    public URLAddEditGroupPage: string = httpModulesPages.urlCumplimiento_Grupo;

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

        this.distributionChannelForm = this.formBuilder.group({
            
            descripcion: [''],
            porcentaje: [''],
            estado: ['']
        });

        

        this.cumplimientoService.getDistributionChannelsBusiness(this.userObservable.empresa)
            .pipe(first())
            .subscribe(distributionChannelsResponse => {

                if (distributionChannelsResponse.length > 0) {
                    this.showList = true;
                    this.listDistributionChannels = distributionChannelsResponse;
                }
            },
            error => {
                let message : string = 'Problemas al consultar los canales de distribución. ' + error;
                this.alertService.error(message); 
            });
    }

    onAdd() : void {

        this.add = true;
        this.buttomText = 'Registrar';

        this.distributionChannelForm = this.formBuilder.group({
            
            descripcion: ['', Validators.required],
            porcentaje: ['', Validators.required],
            estado: ['A', Validators.required]
        });

        $('#canalDistribucionModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onEdit(distributionChannel:CanalDistribucion) : void {

        this.update = true;
        this.buttomText = 'Actualizar';

        this.distributionChannelForm = this.formBuilder.group({
            descripcion: [distributionChannel.descripcion, Validators.required],
            porcentaje: [distributionChannel.porcentaje, Validators.required],
            estado: [distributionChannel.estado, Validators.required]
        });

        $('#canalDistribucionModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onDelete(distributionChannel:CanalDistribucion) : void {

        this.delete = true;

        if(confirm("Está seguro que desea eliminar el canal de distribución " + distributionChannel.descripcion)) {
            console.log("pos si");
        } else {console.log("pos no");}
    }

    get f() { return this.distributionChannelForm.controls; }

    onSubmit() : void {

        this.alertService.clear();
        this.submitted = true;

        var today = new Date();

        if (this.distributionChannelForm.invalid)
            return;
        
        let distributionChannelForm = new CanalDistribucion();

        distributionChannelForm.codigoCompania = this.companiaObservable.id;
        distributionChannelForm.descripcion = this.distributionChannelForm.get('descripcion').value;
        distributionChannelForm.porcentaje = this.distributionChannelForm.get('porcentaje').value;
        distributionChannelForm.estado = this.distributionChannelForm.get('estado').value;

        if (this.add) {
            distributionChannelForm.adicionadoPor = this.userObservable.identificacion;
            distributionChannelForm.fechaAdicion = today;
 
            // procedure add
        }
        
        if (this.update) {
            distributionChannelForm.modificadoPor = this.userObservable.identificacion;
            distributionChannelForm.fechaModificacion = today;

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