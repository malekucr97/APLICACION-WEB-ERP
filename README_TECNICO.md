# APLICACION-WEB-ERP

## Descripción General
Este proyecto es una aplicación web desarrollada con Angular, orientada a la gestión de módulos empresariales (ERP). Permite la administración de usuarios, roles, análisis financieros, módulos de cumplimiento, inversiones, riesgos de crédito, y más. Incluye integración con servicios externos, autenticación, y una interfaz moderna basada en Angular Material y Tailwind CSS.

## Estructura del Proyecto
- **src/app/**: Contiene la lógica principal de la aplicación.
  - **_components/**: Componentes reutilizables (alertas, diálogos, pie de página, traducción, etc.).
  - **_core/**: Módulo central con servicios y utilidades globales.
  - **_helpers/**: Clases y utilidades auxiliares (interceptores, guardias, etc.).
  - **_models/**: Modelos de datos y entidades del dominio.
  - **_services/**: Servicios para la comunicación con APIs y lógica de negocio.
  - **_shared/**: Módulo compartido con componentes y directivas comunes.
  - **account/**: Módulo de autenticación y gestión de cuentas.
  - **home/**: Página principal y componentes relacionados.
  - **Landing/**: Página de aterrizaje y componentes públicos.
  - **LayoutAdministrator/**: Módulo de administración y gestión avanzada.
  - **ModulosSistema/**: Módulos funcionales del sistema (cumplimiento, inversiones, riesgos, etc.).
- **assets/**: Recursos estáticos (imágenes, fuentes, archivos de traducción, etc.).
- **environments/**: Configuración de entornos (desarrollo y producción).
- **plantilla_correo_mjml/**: Plantillas de correo en HTML y MJML.

## Principales Tecnologías
- **Angular**: Framework principal para el frontend.
- **Angular Material**: Componentes UI.
- **Tailwind CSS**: Utilidades CSS para estilos rápidos y responsivos.
- **RxJS**: Programación reactiva.
- **TypeScript**: Lenguaje principal.
- **MJML**: Plantillas de correo electrónico.

## Instalación y Ejecución
1. **Clonar el repositorio**
   ```powershell
   git clone <URL_DEL_REPOSITORIO>
   cd CLIENTE
   ```
2. **Instalar dependencias**
   ```powershell
   npm install
   ```
3. **Ejecutar la aplicación en desarrollo**
   ```powershell
   ng serve
   ```
   Acceder a `http://localhost:4200` en el navegador.

## Scripts Útiles
- `ng serve`: Levanta el servidor de desarrollo.
- `ng build`: Compila la aplicación para producción.
- `ng test`: Ejecuta pruebas unitarias.
- `ng lint`: Linter para el código fuente.

## Configuración
- **Environments**: Modificar los archivos en `src/environments/` para cambiar endpoints o configuraciones específicas de entorno.
- **Tailwind**: Configuración en `tailwind.config.js`.
- **Angular**: Configuración global en `angular.json` y `tsconfig*.json`.

## Estructura de Módulos
Cada módulo funcional (por ejemplo, Macred, Cumplimiento, Inversiones) tiene su propio subdirectorio bajo `src/app/ModulosSistema/`, con componentes, servicios y modelos específicos.

## Seguridad
- **Autenticación JWT**: Implementada mediante interceptores y guardias en `_helpers/` y servicios en `_services/`.
- **Roles y permisos**: Definidos en los modelos y gestionados en los módulos de administración.

## Plantillas de Correo
Las plantillas en `plantilla_correo_mjml/` pueden ser editadas y convertidas a HTML para notificaciones automáticas.

## Pruebas
- Pruebas unitarias configuradas con Karma y Jasmine.
- Archivos de configuración: `karma.conf.js`, `tsconfig.spec.json`.

## Contribución
1. Crear una rama para la nueva funcionalidad o corrección.
2. Realizar los cambios y pruebas necesarias.
3. Hacer un pull request describiendo los cambios.

## Licencia
Este proyecto está bajo la licencia MIT.

## Contacto
Para dudas o soporte, contactar a los administradores del repositorio o revisar la documentación interna.
