import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService} from '@app/_services';
import { User, Module } from '@app/_models';
import { first } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '../../../../_models/modules/compania';
import { CumplimientoService } from '@app/_services/cumplimiento.service';
import { ActivatedRoute } from '@angular/router';
import { MovimientoHaberRiesgo } from '@app/_models/Cumplimiento/MovimientoHaberRiesgo';

declare var $: any;

@Component({
    templateUrl: 'HTML_MovimientoHaber.html',
    styleUrls: ['../../../../../assets/scss/cumplimiento/app.scss'],
})
export class MovimientoHaberComponent implements OnInit {
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

    MovementHavingForm: FormGroup;

    listMovementsHaving: MovimientoHaberRiesgo[];

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

        this.MovementHavingForm = this.formBuilder.group({
            
            descripcion: [''],
            montoInferior: [''],
            montoSuperior: [''],
            valorRiesgo: [''],
            estado: ['']
        });

        

        this.cumplimientoService.getMovementsHavingBusiness(this.userObservable.empresa)
            .pipe(first())
            .subscribe(MovementsHavingResponse => {

                if (MovementsHavingResponse.length > 0) {
                    this.showList = true;
                    this.listMovementsHaving = MovementsHavingResponse;
                }
            },
            error => {
                let message : string = 'Problemas al consultar los movimientos haber riesgos. ' + error;
                this.alertService.error(message); 
            });
    }

    onAdd() : void {

        this.add = true;
        this.buttomText = 'Registrar';

        this.MovementHavingForm = this.formBuilder.group({
            
            descripcion: ['', Validators.required],
            montoInferior: ['', Validators.required],
            montoSuperior: ['', Validators.required],
            valorRiesgo: ['', Validators.required],
            estado: ['A', Validators.required]
            
        });

        $('#movimientoHaberModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onEdit(movimientoHaber:MovimientoHaberRiesgo) : void {

        this.update = true;
        this.buttomText = 'Actualizar';

        this.MovementHavingForm = this.formBuilder.group({

            descripcion: [movimientoHaber.descripcion, Validators.required],
            montoInferior: [movimientoHaber.montoInferior, Validators.required],
            montoSuperior: [movimientoHaber.montoSuperior, Validators.required],
            valorRiesgo: [movimientoHaber.valorRiesgo, Validators.required],
            estado: [movimientoHaber.estado, Validators.required]
        });

        $('#movimientoHaberModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onDelete(movimientoHaber:MovimientoHaberRiesgo) : void {

        this.delete = true;

        if(confirm("Está seguro que desea eliminar el movimiento " + movimientoHaber.descripcion)) {
            console.log("pos si");
        } else {console.log("pos no");}
    }

    get f() { return this.MovementHavingForm.controls; }

    onSubmit() : void {

        this.alertService.clear();
        this.submitted = true;

        var today = new Date();

        if (this.MovementHavingForm.invalid)
            return;
        
        let MovementHavingForm = new MovimientoHaberRiesgo();

        MovementHavingForm.codigoCompania = this.companiaObservable.id;
        MovementHavingForm.descripcion = this.MovementHavingForm.get('descripcion').value;
        MovementHavingForm.montoInferior = this.MovementHavingForm.get('montoInferior').value;
        MovementHavingForm.montoSuperior = this.MovementHavingForm.get('montoSuperior').value;
        MovementHavingForm.valorRiesgo = this.MovementHavingForm.get('valorRiesgo').value;
        MovementHavingForm.estado = this.MovementHavingForm.get('estado').value;

        if (this.add) {
            MovementHavingForm.adicionadoPor = this.userObservable.identificacion;
            MovementHavingForm.fechaAdicion = today;
 
            // procedure add
        }
        
        if (this.update) {
            MovementHavingForm.modificadoPor = this.userObservable.identificacion;
            MovementHavingForm.fechaModificacion = today;

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