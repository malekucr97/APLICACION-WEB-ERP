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
import { Articulo15 } from '@app/_models/Cumplimiento/Articulo15';

declare var $: any;

@Component({
    templateUrl: 'HTML_Articulo15.html',
    styleUrls: ['../../../../../assets/scss/cumplimiento/app.scss'],
})
export class Articulo15Component implements OnInit {
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

    article15Form: FormGroup;

    listArticle15: ActividadEconomica[];

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

        this.article15Form = this.formBuilder.group({
            
            descripcion: [''],
            valorRiesgo: [''],
            estado: ['']
        });

        

        this.cumplimientoService.getArticle15Business(this.userObservable.empresa)
            .pipe(first())
            .subscribe(article15Response => {

                if (article15Response.length > 0) {
                    this.showList = true;
                    this.listArticle15 = article15Response;
                }
            },
            error => {
                let message : string = 'Problemas al consultar el artículo 15. ' + error;
                this.alertService.error(message); 
            });
    }

    onAdd() : void {

        this.add = true;
        this.buttomText = 'Registrar';

        this.article15Form = this.formBuilder.group({
            
            descripcion: ['', Validators.required],
            valorRiesgo: ['', Validators.required],
            estado: ['A', Validators.required]
        });

        $('#articulo15Modal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onEdit(article15:Articulo15) : void {

        this.update = true;
        this.buttomText = 'Actualizar';

        this.article15Form = this.formBuilder.group({
            descripcion: [article15.descripcion, Validators.required],
            valorRiesgo: [article15.valorRiesgo, Validators.required],
            estado: [article15.estado, Validators.required]
        });

        $('#articulo15Modal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onDelete(article15:Articulo15) : void {

        this.delete = true;

        if(confirm("Está seguro que desea eliminar el riesgo de artículo 15 " + article15.descripcion)) {
            console.log("pos si");
        } else {console.log("pos no");}
    }

    get f() { return this.article15Form.controls; }

    onSubmit() : void {

        this.alertService.clear();
        this.submitted = true;

        var today = new Date();

        if (this.article15Form.invalid)
            return;
        
        let article15Form = new Articulo15();

        article15Form.codigoCompania = this.companiaObservable.id;
        article15Form.descripcion = this.article15Form.get('descripcion').value;
        article15Form.valorRiesgo = this.article15Form.get('valorRiesgo').value;
        article15Form.estado = this.article15Form.get('estado').value;

        if (this.add) {
            article15Form.adicionadoPor = this.userObservable.identificacion;
            article15Form.fechaAdicion = today;
 
            // procedure add
        }
        
        if (this.update) {
            article15Form.modificadoPor = this.userObservable.identificacion;
            article15Form.fechaModificacion = today;

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