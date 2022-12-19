import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService} from '@app/_services';
import { User, Module } from '@app/_models';
import { first } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '../../../../_models/modules/compania';
import { NivelRiesgo } from '@app/_models/Cumplimiento/NivelRiesgo';
import { CumplimientoService } from '@app/_services/cumplimiento.service';
import { ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
    templateUrl: 'HTML_NivelRiesgo.html',
    styleUrls: ['../../../../../assets/scss/cumplimiento/app.scss'],
})
export class NivelRiesgoComponent implements OnInit {
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

    riskForm: FormGroup;

    listRiskLevel: NivelRiesgo[];

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

        this.riskForm = this.formBuilder.group({
            codigoNivel: [''],
            descripcion: [''],
            minimo: [''],
            maximo: [''],
            codigoSugef: [''],
            estado: ['']
        });

        

        this.cumplimientoService.getRiskLevelBusiness(this.userObservable.empresa)
            .pipe(first())
            .subscribe(riskLevelResponse => {

                if (riskLevelResponse.length > 0) {
                    this.showList = true;
                    this.listRiskLevel = riskLevelResponse;
                }
            },
            error => {
                let message : string = 'Problemas al consultar los grupos de riesgo. ' + error;
                this.alertService.error(message); 
            });
    }

    onAdd() : void {

        this.add = true;
        this.buttomText = 'Registrar';

        this.riskForm = this.formBuilder.group({
            
            codigoNivel: ['', Validators.required],
            descripcion: ['', Validators.required],
            minimo: ['', Validators.required],
            maximo: ['', Validators.required],
            codigoSugef: ['', Validators.required],
            estado: ['A', Validators.required]
        });

        $('#nivelRiesgoModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onEdit(riskLevel:NivelRiesgo) : void {

        this.update = true;
        this.buttomText = 'Actualizar';

        this.riskForm = this.formBuilder.group({
            codigoNivel: [riskLevel.codigoNivel, Validators.required],
            descripcion: [riskLevel.descripcion, Validators.required],
            minimo: [riskLevel.minimo, Validators.required],
            maximo: [riskLevel.maximo, Validators.required],
            codigoSugef: [riskLevel.codigoSugef, Validators.required],
            estado: [riskLevel.estado, Validators.required]
        });

        $('#nivelRiesgoModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onDelete(riskLevel:NivelRiesgo) : void {

        this.delete = true;

        if(confirm("Está seguro que desea eliminar el nivel de riesgo " + riskLevel.descripcion)) {
            console.log("pos si");
        } else {console.log("pos no");}
    }

    get f() { return this.riskForm.controls; }

    onSubmit() : void {

        this.alertService.clear();
        this.submitted = true;

        var today = new Date();

        if (this.riskForm.invalid)
            return;
        
        let riskForm = new NivelRiesgo();

        riskForm.codigoCompania = this.companiaObservable.id;
        riskForm.codigoNivel = this.riskForm.get('codigoNivel').value;
        riskForm.descripcion = this.riskForm.get('descripcion').value;
        riskForm.minimo = this.riskForm.get('minimo').value;
        riskForm.maximo = this.riskForm.get('maximo').value;
        riskForm.codigoSugef = this.riskForm.get('codigoSugef').value;
        riskForm.estado = this.riskForm.get('estado').value;

        if (this.add) {
            riskForm.adicionadoPor = this.userObservable.identificacion;
            riskForm.fechaAdicion = today;
 
            // procedure add
        }
        
        if (this.update) {
            riskForm.modificadoPor = this.userObservable.identificacion;
            riskForm.fechaModificacion = today;

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