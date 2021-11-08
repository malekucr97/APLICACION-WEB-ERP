import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

import { User } from '../_models';
import { Module } from '@app/_models/module';

import { ModulesProperties } from '../_models/module';

import { amdinBusiness } from '@environments/environment';
import { localVariables } from '@environments/environment';


@Component({
    templateUrl: 'HTML_BusinessPage.html',
    styleUrls: ['../../assets/scss/HTML_BusinessPage.scss']
})
export class BusinessPageComponent implements OnInit {
    // tslint:disable-next-line: new-parens
    user = new User;

    propertiesMod: ModulesProperties;

    public listActModules: Module[] = [];

    public listModulesInfo: ModulesProperties[] = [];

    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {

        // LISTA TODOS LOS MÓDULOS ACTIVOS EN LA EMPRESA PARA LOS ADMINISTRADORES DEL SISTEMA
        if (this.user.esAdmin || this.user.idRol === amdinBusiness.adminSociedad) {

            this.accountService.getModulesActiveBusiness(this.user.empresa)
            .pipe(first())
            .subscribe(responseList => {

                if (responseList){

                    this.listActModules = responseList;

                    this.listActModules.forEach(mod => {

                        this.propertiesMod = new ModulesProperties();

                        this.propertiesMod.id = mod.identificador;
                        this.propertiesMod.nombre = mod.nombre;
                        this.propertiesMod.path =  localVariables.dir_img_modules + mod.identificador + '.png';
                        this.propertiesMod.descripcion =  mod.descripcion;

                        this.listModulesInfo.push(this.propertiesMod);

                    });
                }
            });

        // CONSULTA LOS MÓDULOS ACTIVOS DE UN USUARIO CON PRIVILEGIOS
        } else {

            this.accountService.getModulesActiveUser(this.user.empresa, this.user.idRol)
            .pipe(first())
            .subscribe(responseList => {

                if (responseList){

                    this.listActModules = responseList;

                    this.listActModules.forEach(mod => {

                        this.propertiesMod = new ModulesProperties();

                        this.propertiesMod.id = mod.identificador;
                        this.propertiesMod.nombre = mod.nombre;
                        this.propertiesMod.path =  localVariables.dir_img_modules + mod.identificador + '.png';
                        this.propertiesMod.descripcion =  mod.descripcion;

                        this.listModulesInfo.push(this.propertiesMod);

                    });
                }
            });
        }
    }

    selectedModule(module: Module){
        var mod = module;
    }
}
