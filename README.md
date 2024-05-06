# angular-9-registration-login-example

Angular 9 - User Registration and Login Example

Full tutorial with example available at https://jasonwatmore.com/post/2020/04/28/angular-9-user-registration-and-login-example-tutorial

git : https://github.com/malekucr97/APLICACION-WEB-ERP.git

1. Node js : https://nodejs.org/en/download/
2. npm install -g npm@8.19.1
3. npm update -g
4. En Windows PowerShell:
4. set-executionpolicy unrestricted
5. npm i --only=dev
6. Agregar variables de ambiente al path: (instalar python)
7. C:\Users\marco\AppData\Roaming\npm & C:\Program Files\nodejs\
6. npm install --global yarn
6. yarn
8. npm run build
7. npm run start


**2024**

1 - HABILITAR FRONT MODO DESARROLLO: ng serve -o --configuration development

2 - HABILITAR BACK MODO DESARROLLO: Configurar el proyecto modo Debug e Iniciar el proyecto AccessAdministration

3 - COMPILAR FRONT CAROERA DIST: npm run ng build -- --configuration=production

4 - PARA PUBLICAR FRONT EN PRODUCCIÓN SE HACE PULL REQUEST A BRANCH: publicadoAzure

5 - PUBLICAR API EN AZURE: az webapp deployment source config-zip --resource-group SecureBI --name apiBIWindows --src 'C:\publicadosAppService\azure.zip'

(EL .zip NO SE DEBE DE GENERAR DESDE UNA CARPETA, SE DEBEN DE SELECCIONAR TODOS LOS ARCHIVOS PREVIAMENTE PUBLICADOS DESE EL VISUAL STUDIO Y GENERAR EL .zip CON CLICK DERECHO, ENVIAR A->CARPETA COMPRIMIDA EN .zip)
