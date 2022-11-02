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
import { MovimientoDebeRiesgo } from '@app/_models/Cumplimiento/MovimientoDebeRiesgo';

declare var $: any;

@Component({
    templateUrl: 'HTML_MovimientoDebe.html',
    styleUrls: ['../../../../../assets/scss/cumplimiento/app.scss'],
})
export class MovimientoDebeComponent implements OnInit {
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

    MovementDebitForm: FormGroup;

    listMovementsDebit: MovimientoDebeRiesgo[];

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

        this.MovementDebitForm = this.formBuilder.group({
            
            descripcion: [''],
            montoInferior: [''],
            montoSuperior: [''],
            valorRiesgo: [''],
            estado: ['']
        });

        

        this.cumplimientoService.getMovementsDebitBusiness(this.userObservable.empresa)
            .pipe(first())
            .subscribe(MovementsDebitResponse => {

                if (MovementsDebitResponse.length > 0) {
                    this.showList = true;
                    this.listMovementsDebit = MovementsDebitResponse;
                }
            },
            error => {
                let message : string = 'Problemas al consultar los movimientos debe riesgos. ' + error;
                this.alertService.error(message); 
            });
    }

    onAdd() : void {

        this.add = true;
        this.buttomText = 'Registrar';

        this.MovementDebitForm = this.formBuilder.group({
            
            descripcion: ['', Validators.required],
            montoInferior: ['', Validators.required],
            montoSuperior: ['', Validators.required],
            valorRiesgo: ['', Validators.required],
            estado: ['A', Validators.required]
            
        });

        $('#movimientoDebeModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onEdit(movimientoDebe:MovimientoDebeRiesgo) : void {

        this.update = true;
        this.buttomText = 'Actualizar';

        this.MovementDebitForm = this.formBuilder.group({

            descripcion: [movimientoDebe.descripcion, Validators.required],
            montoInferior: [movimientoDebe.montoInferior, Validators.required],
            montoSuperior: [movimientoDebe.montoSuperior, Validators.required],
            valorRiesgo: [movimientoDebe.valorRiesgo, Validators.required],
            estado: [movimientoDebe.estado, Validators.required]
        });

        $('#movimientoDebeModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onDelete(movimientoDebe:MovimientoDebeRiesgo) : void {

        this.delete = true;

        if(confirm("Está seguro que desea eliminar el movimiento " + movimientoDebe.descripcion)) {
            console.log("pos si");
        } else {console.log("pos no");}
    }

    get f() { return this.MovementDebitForm.controls; }

    onSubmit() : void {

        this.alertService.clear();
        this.submitted = true;

        var today = new Date();

        if (this.MovementDebitForm.invalid)
            return;
        
        let MovementDebitForm = new MovimientoDebeRiesgo();

        MovementDebitForm.codigoCompania = this.companiaObservable.id;
        MovementDebitForm.descripcion = this.MovementDebitForm.get('descripcion').value;
        MovementDebitForm.montoInferior = this.MovementDebitForm.get('montoInferior').value;
        MovementDebitForm.montoSuperior = this.MovementDebitForm.get('montoSuperior').value;
        MovementDebitForm.valorRiesgo = this.MovementDebitForm.get('valorRiesgo').value;
        MovementDebitForm.estado = this.MovementDebitForm.get('estado').value;

        if (this.add) {
            MovementDebitForm.adicionadoPor = this.userObservable.identificacion;
            MovementDebitForm.fechaAdicion = today;
 
            // procedure add
        }
        
        if (this.update) {
            MovementDebitForm.modificadoPor = this.userObservable.identificacion;
            MovementDebitForm.fechaModificacion = today;

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