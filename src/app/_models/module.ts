export class Module {

    constructor(public id:number,
                public identificador:string,
                public nombre:string,
                public descripcion:string,
                public estado:string,
                public pathLogo:string,
                public pathIco:string,
                public indexHTTP:string ) {
    }
}

export class ModuleScreen {

    public descripcion:string;

    constructor() { }
}

export class ModuleSubMenu {

    constructor(public id:number,
                public descripcion:string) { }
}