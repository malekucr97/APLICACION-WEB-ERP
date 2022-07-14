import { baseEntity } from "./baseEntity";

export class adnObject {

    // NOMBRE DE LA OPERACIÓN QUE SE VA A PROCESAR EN LA BASE DE DATOS
    OperationName : string;

    // NOMBRE DEL MÓDULO EN QUE SE EJECUTA LA ACCIÓN
    Module : string;

    // LISTA DE OBJETOS QUE SE VAN A PROCESAR
    ObjectToProcess : baseEntity[];
}