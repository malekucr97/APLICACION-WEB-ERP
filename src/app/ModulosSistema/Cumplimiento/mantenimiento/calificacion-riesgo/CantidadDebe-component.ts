import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService} from '@app/_services';
import { User, Module } from '@app/_models';
import { first } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '../../../../_models/modules/compania';
import { CumplimientoService } from '@app/_services/cumplimiento.service';
import { ActivatedRoute } from '@angular/router';
import { httpModulesPages } from '@environments/environment-access-admin';
import { CantidadDebeRiesgo } from '@app/_models/Cumplimiento/CantidadDebeRiesgo';

declare var $: any;

@Component({
    templateUrl: 'HTML_CantidadDebe.html',
    styleUrls: ['../../../../../assets/scss/cumplimiento/app.scss'],
})
export class CantidadDebeComponent implements OnInit {
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

    QuantityDebitForm: FormGroup;

    listQuantitiesDebit: CantidadDebeRiesgo[];

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

        this.QuantityDebitForm = this.formBuilder.group({
            
            descripcion: [''],
            cantidadInferior: [''],
            cantidadSuperior: [''],
            valorRiesgo: [''],
            estado: ['']
        });

        

        this.cumplimientoService.getQuantitiesDebitBusiness(this.userObservable.empresa)
            .pipe(first())
            .subscribe(QuantitiesDebitResponse => {

                if (QuantitiesDebitResponse.length > 0) {
                    this.showList = true;
                    this.listQuantitiesDebit = QuantitiesDebitResponse;
                }
            },
            error => {
                let message : string = 'Problemas al consultar la cantidad de movimientos debe riesgos. ' + error;
                this.alertService.error(message); 
            });
    }

    onAdd() : void {

        this.add = true;
        this.buttomText = 'Registrar';

        this.QuantityDebitForm = this.formBuilder.group({
            
            descripcion: ['', Validators.required],
            cantidadInferior: ['', Validators.required],
            cantidadSuperior: ['', Validators.required],
            valorRiesgo: ['', Validators.required],
            estado: ['A', Validators.required]
            
        });

        $('#cantidadDebeModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onEdit(cantidadDebe:CantidadDebeRiesgo) : void {

        this.update = true;
        this.buttomText = 'Actualizar';

        this.QuantityDebitForm = this.formBuilder.group({

            descripcion: [cantidadDebe.descripcion, Validators.required],
            cantidadInferior: [cantidadDebe.cantidadInferior, Validators.required],
            cantidadSuperior: [cantidadDebe.cantidadSuperior, Validators.required],
            valorRiesgo: [cantidadDebe.valorRiesgo, Validators.required],
            estado: [cantidadDebe.estado, Validators.required]
        });

        $('#cantidadDebeModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onDelete(cantidadDebe:CantidadDebeRiesgo) : void {

        this.delete = true;

        if(confirm("Está seguro que desea eliminar el registro de cantidad de movimientos " + cantidadDebe.descripcion)) {
            console.log("pos si");
        } else {console.log("pos no");}
    }

    get f() { return this.QuantityDebitForm.controls; }

    onSubmit() : void {

        this.alertService.clear();
        this.submitted = true;

        var today = new Date();

        if (this.QuantityDebitForm.invalid)
            return;
        
        let QuantityDebitForm = new CantidadDebeRiesgo();

        QuantityDebitForm.codigoCompania = this.companiaObservable.id;
        QuantityDebitForm.descripcion = this.QuantityDebitForm.get('descripcion').value;
        QuantityDebitForm.cantidadInferior = this.QuantityDebitForm.get('cantidadInferior').value;
        QuantityDebitForm.cantidadSuperior = this.QuantityDebitForm.get('cantidadSuperior').value;
        QuantityDebitForm.valorRiesgo = this.QuantityDebitForm.get('valorRiesgo').value;
        QuantityDebitForm.estado = this.QuantityDebitForm.get('estado').value;

        if (this.add) {
            QuantityDebitForm.adicionadoPor = this.userObservable.identificacion;
            QuantityDebitForm.fechaAdicion = today;
 
            // procedure add
        }
        
        if (this.update) {
            QuantityDebitForm.modificadoPor = this.userObservable.identificacion;
            QuantityDebitForm.fechaModificacion = today;

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