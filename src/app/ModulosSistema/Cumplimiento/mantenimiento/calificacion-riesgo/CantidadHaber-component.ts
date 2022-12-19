import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService} from '@app/_services';
import { User, Module } from '@app/_models';
import { first } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '../../../../_models/modules/compania';
import { CumplimientoService } from '@app/_services/cumplimiento.service';
import { ActivatedRoute } from '@angular/router';
import { CantidadHaberRiesgo } from '@app/_models/Cumplimiento/CantidadHaberRiesgo';

declare var $: any;

@Component({
    templateUrl: 'HTML_CantidadHaber.html',
    styleUrls: ['../../../../../assets/scss/cumplimiento/app.scss'],
})
export class CantidadHaberComponent implements OnInit {
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

    QuantityHavingForm: FormGroup;

    listQuantitiesHaving: CantidadHaberRiesgo[];

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

        this.QuantityHavingForm = this.formBuilder.group({
            
            descripcion: [''],
            cantidadInferior: [''],
            cantidadSuperior: [''],
            valorRiesgo: [''],
            estado: ['']
        });

        

        this.cumplimientoService.getQuantitiesHavingBusiness(this.userObservable.empresa)
            .pipe(first())
            .subscribe(QuantitiesHavingResponse => {

                if (QuantitiesHavingResponse.length > 0) {
                    this.showList = true;
                    this.listQuantitiesHaving = QuantitiesHavingResponse;
                }
            },
            error => {
                let message : string = 'Problemas al consultar la cantidad de movimientos haber riesgos. ' + error;
                this.alertService.error(message); 
            });
    }

    onAdd() : void {

        this.add = true;
        this.buttomText = 'Registrar';

        this.QuantityHavingForm = this.formBuilder.group({
            
            descripcion: ['', Validators.required],
            cantidadInferior: ['', Validators.required],
            cantidadSuperior: ['', Validators.required],
            valorRiesgo: ['', Validators.required],
            estado: ['A', Validators.required]
            
        });

        $('#cantidadHaberModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onEdit(cantidadHaber:CantidadHaberRiesgo) : void {

        this.update = true;
        this.buttomText = 'Actualizar';

        this.QuantityHavingForm = this.formBuilder.group({

            descripcion: [cantidadHaber.descripcion, Validators.required],
            cantidadInferior: [cantidadHaber.cantidadInferior, Validators.required],
            cantidadSuperior: [cantidadHaber.cantidadSuperior, Validators.required],
            valorRiesgo: [cantidadHaber.valorRiesgo, Validators.required],
            estado: [cantidadHaber.estado, Validators.required]
        });

        $('#cantidadHaberModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onDelete(cantidadHaber:CantidadHaberRiesgo) : void {

        this.delete = true;

        if(confirm("Está seguro que desea eliminar el registro de cantidad de movimientos " + cantidadHaber.descripcion)) {
            console.log("pos si");
        } else {console.log("pos no");}
    }

    get f() { return this.QuantityHavingForm.controls; }

    onSubmit() : void {

        this.alertService.clear();
        this.submitted = true;

        var today = new Date();

        if (this.QuantityHavingForm.invalid)
            return;
        
        let QuantityHavingForm = new CantidadHaberRiesgo();

        QuantityHavingForm.codigoCompania = this.companiaObservable.id;
        QuantityHavingForm.descripcion = this.QuantityHavingForm.get('descripcion').value;
        QuantityHavingForm.cantidadInferior = this.QuantityHavingForm.get('cantidadInferior').value;
        QuantityHavingForm.cantidadSuperior = this.QuantityHavingForm.get('cantidadSuperior').value;
        QuantityHavingForm.valorRiesgo = this.QuantityHavingForm.get('valorRiesgo').value;
        QuantityHavingForm.estado = this.QuantityHavingForm.get('estado').value;

        if (this.add) {
            QuantityHavingForm.adicionadoPor = this.userObservable.identificacion;
            QuantityHavingForm.fechaAdicion = today;
 
            // procedure add
        }
        
        if (this.update) {
            QuantityHavingForm.modificadoPor = this.userObservable.identificacion;
            QuantityHavingForm.fechaModificacion = today;

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