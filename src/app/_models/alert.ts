export class Alert {

    id?: string;
    type?: AlertType;
    message?: string;
    autoClose?: boolean;
    keepAfterRouteChange?: boolean;
    fade?: boolean;

    constructor( init?: Partial<Alert> ) {  Object.assign(this, init); }

    // 🔹 Propiedad calculada para aplicar clases CSS dinámicas
    get cssClass(): string {

        if (!this.type) return '';

        switch (this.type) {
            case AlertType.Success: return 'alert-success';
            case AlertType.Error:   return 'alert-error';
            case AlertType.Info:    return 'alert-info';
            case AlertType.Warning: return 'alert-warning';
            
            default: return '';
        }
    }
}

export enum AlertType {
  Success = 'Success',
  Error = 'Error',
  Info = 'Info',
  Warning = 'Warning'
}