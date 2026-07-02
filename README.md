#  Proyecto Integrador 4

## Índice

- [Descripción del proyecto](#descripción-del-proyecto)
- [Stack tecnológico](#stack-tecnológico)
- [Objetivo del sistema](#objetivo-del-sistema)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Seguridad](#seguridad)
- [Firebase](#firebase)
- [AWS SES](#aws-ses)
- [Tests](#tests)
- [Cómo ejecutar el proyecto localmente](#cómo-ejecutar-el-proyecto-localmente)
- [Deploy en Vercel](#deploy-en-vercel)
- [Documentación de IA](#documentación-de-ia)

## Descripción del proyecto

Este proyecto es una aplicación web tipo To-Do List donde los usuarios pueden gestionar sus tareas de forma simple y ordenada.

La app tiene un sistema de login que permite registrarse, iniciar sesión o entrar con Google. Una vez dentro, el usuario accede a una lista de tareas que se carga desde Firebase. Si no tiene tareas creadas, se muestra la lista vacía.

Dentro de la aplicación se pueden crear tareas nuevas, editarlas, marcarlas como completadas y eliminarlas. También se puede enviar un resumen de las tareas por correo usando una función serverless conectada con AWS SES.

Además, el usuario puede cerrar sesión en cualquier momento, lo que lo devuelve nuevamente a la pantalla de login.

A continuación se proporciona la representación visual de la App:
### 1. Versión desktop:
Se representan en orden: login, tasks page y formulario agregar nueva tarea.

![Login de la app versión desktop](/react-pi/DocsIMG/login.png)
![Tasks más el formulario para agregar task](/react-pi/DocsIMG/tasks_formtasks.png)

### 2. Versión mobile:
Se representan en orden: login, tasks page y formulario agregar nueva tarea.

![Versión mobile](/react-pi/DocsIMG/mobile.png)

[⬆ Volver al inicio](#proyecto-integrador-4)


## Stack tecnológico

Este proyecto fue desarrollado utilizando las siguientes tecnologías:

- React + TypeScript: para la construcción de la interfaz y la lógica de la aplicación
- Vite: como entorno de desarrollo rápido y optimizado
- CSS: para los estilos y la estructura visual de la aplicación
- Firebase:
  - Authentication (incluye login con Google)
  - Firestore para el almacenamiento de tareas en tiempo real
- AWS SES: para el envío de correos electrónicos mediante una función serverless
- Serverless Functions: para manejar lógica backend sin exponer credenciales en el frontend
- Vitest: para la ejecución de tests unitarios
- Vercel: para el deploy y hosting de la aplicación

## Objetivo del sistema

Este proyecto se desarrolla en el contexto de una simulación profesional donde se trabaja como desarrollador/a Full Stack Junior para una startup ficticia llamada MateCode, que crea soluciones web para pequeñas empresas.

En este caso, el cliente necesita una aplicación web que permita a sus empleados gestionar tareas diarias de forma organizada, persistente y accesible desde cualquier dispositivo.

El objetivo es construir una SPA funcional que resuelva esta necesidad utilizando un enfoque basado en servicios administrados (BaaS), aprovechando herramientas modernas como Firebase y AWS.

La aplicación debe permitir el registro y autenticación de usuarios, la gestión completa de tareas (CRUD), la persistencia de datos en la nube por usuario y el envío de notificaciones por correo electrónico.

Además, el proyecto busca aplicar buenas prácticas de desarrollo como tipado con TypeScript, arquitectura organizada, testing de componentes y manejo seguro de credenciales, junto con un deploy funcional en producción.

[⬆ Volver al inicio](#proyecto-integrador-4)


## Arquitectura del proyecto

El proyecto sigue una arquitectura por capas, separando la UI, la lógica de negocio, el acceso a datos y el backend serverless.


### Estructura general

```txt id="struct3"
/src
│
├── App.tsx              # Componente raíz de la aplicación
├── main.tsx             # Punto de entrada de React
├── RequireAuth.tsx      # Protección de rutas privadas
├── setupTests.ts        # Configuración de entorno de tests
│
├── App.css              # Estilos globales de App
├── index.css            # Estilos globales generales
│
├── components
│   ├── EmailSummaryBtn.tsx  # Botón para enviar resumen por email
│   ├── TodoForm.tsx         # Formulario para crear tareas
│   ├── TodoItem.tsx         # Componente de una tarea individual
│   └── TodoList.tsx         # Lista de tareas
│
├── features
│   └── auth
│       ├── Authenticator.tsx # Lógica de autenticación (Google/email)
│       └── authErrors.ts     # Manejo de errores de auth
│
├── hooks
│   └── useTasks.ts          # Hook principal para gestión de tareas
│
├── pages
│   ├── login
│   │   ├── LoginPage.tsx    # Página de login
│   │   └── LoginPage.css    # Estilos del login
│   │
│   └── tasks
│       ├── Tasks.tsx        # Página principal de tareas
│       └── Tasks.css        # Estilos de tareas
│
├── services
│   ├── firebase.ts          # Configuración de Firebase
│   └── tasks.ts             # Lógica de acceso a tareas (CRUD)
│
├── tests
│   ├── getTaskByUser.test.ts   # Test obtención de tareas por usuario
│   ├── todoForm.test.tsx       # Test del formulario de tareas
│   └── useTasksTest.test.ts    # Test del hook useTasks
│
├── types
│   └── task.ts              # Tipo TypeScript de una tarea
│
└── utils
    └── utils.ts            # Funciones auxiliares reutilizables
```

[⬆ Volver al inicio](#proyecto-integrador-4)

## Seguridad
La aplicación implementa varias medidas de seguridad para proteger los datos de los usuarios y las credenciales del sistema.

- Las variables sensibles (como claves de Firebase o AWS) se almacenan en archivos `.env` y nunca se exponen en el frontend.
- El archivo `.env` está incluido en `.gitignore` para evitar que se suba al repositorio.
- El acceso a los datos está controlado mediante reglas de Firestore, asegurando que cada usuario solo pueda acceder a sus propias tareas.
- Las operaciones sensibles, como el envío de emails, se realizan desde funciones serverless para evitar exponer credenciales en el cliente.


## Firebase

Firebase se utiliza como Backend as a Service para manejar la autenticación y el almacenamiento de datos.

- Crear una cuenta en Firebase y generar un nuevo proyecto.
- Habilitar los servicios de **Authentication** y **Firestore**.
- Obtener las credenciales de configuración del proyecto desde la consola de Firebase.
- Configurar las variables de entorno (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc.) con los valores proporcionados por Firebase.
- Si la dependencia no se encuentra instalada, ejecutar:

```bash
npm install firebase
```

- Authentication permite el registro, login y acceso con Google.
- Firestore almacena las tareas de cada usuario de forma persistente.
- Cada usuario tiene sus datos asociados mediante su `uid`.

[⬆ Volver al inicio](#proyecto-integrador-4)

## AWS SES

El envío de correos electrónicos se realiza utilizando **AWS Simple Email Service (SES)**.

- Es necesario crear una cuenta en AWS y acceder al servicio **Amazon SES**.
- Se debe verificar la dirección de correo electrónico (o el dominio) que será utilizada para enviar los correos.
- Configurar las credenciales de acceso (Access Key y Secret Access Key) con permisos para SES.
- Definir las variables de entorno necesarias para que la función `send-email.ts` pueda autenticarse con AWS.
- El frontend no se comunica directamente con AWS, sino con una función serverless (`send-email.ts`), lo que evita exponer las credenciales al cliente.
- Esta función se utiliza para enviar un resumen de las tareas al correo electrónico del usuario.


## Tests
- **useTasksTest.test.ts:** Contiene las pruebas del hook useTasks, verificando las operaciones CRUD de las tareas. Se comprueba la creación, obtención, actualización y eliminación de tareas, asegurando que cada operación modifique correctamente el estado y maneje las respuestas esperadas.

- **todoForm.test.tsx:** Incluye las pruebas del componente TodoForm. Se valida el correcto funcionamiento del formulario, verificando que una tarea pueda crearse exitosamente cuando se ingresan datos válidos y se envía el formulario.

- **getTaskByUser.test.ts:** Contiene las pruebas de la funcionalidad para obtener las tareas asociadas a un usuario específico. Se verifica que la consulta retorne únicamente las tareas correspondientes al usuario solicitado y que la respuesta tenga el formato esperado.

El proyecto incluye pruebas automatizadas utilizando **Vitest** y **React Testing Library**.

- Antes de ejecutar los tests es necesario instalar Vitest en el proyecto:
```bash
npm install vitest
```
- Luego se testea:
```bash
npm run test
```
## Cómo ejecutar el proyecto localmente

Para ejecutar el proyecto en entorno local:

```bash id="run1"
npm install
npm run dev
```
La aplicación se abrirá en http://localhost:5173 (por defecto con Vite).

### Variables de entorno

Es necesario crear un archivo .env en la raíz del proyecto con las siguientes variables:

```bash
VITE_FIREBASE_API_KEY=tu_apiKey
VITE_FIREBASE_AUTH_DOMAIN=tu_authDomain
VITE_FIREBASE_PROJECT_ID=tu_projectId
VITE_FIREBASE_APP_ID=tu_appId
AWS_REGION=region_aws
AWS_ACCESS_KEY_ID=tu_contraseña_publica
AWS_SECRET_ACCESS_KEY=tu_contraseña_privada
SES_FROM_EMAIL=email_donde_enviar
```
[⬆ Volver al inicio](#proyecto-integrador-4)

## Deploy en Vercel

El despliegue del proyecto se realiza utilizando Vercel, una plataforma que permite publicar aplicaciones web de forma rápida y sencilla.

### Pasos para el deploy

- Conectar el repositorio de GitHub con Vercel.
- Importar el proyecto desde el dashboard de Vercel.
- Configurar las variables de entorno necesarias en la sección de settings del proyecto.
- Asegurarse de incluir el prefijo `VITE_` en las variables que se utilizan en el frontend.
- Realizar el deploy inicial.

### Funcionamiento del deploy

- Cada vez que se realiza un push al repositorio, Vercel actualiza automáticamente la aplicación.
- La aplicación queda disponible en una URL pública proporcionada por Vercel.
- Las serverless functions (como el envío de emails) se despliegan junto con el proyecto sin configuración adicional.

### Recomendaciones

- Verificar que todas las variables de entorno estén correctamente configuradas antes del deploy.
- Probar la aplicación en local antes de subir cambios a producción.
- Revisar la consola de Vercel en caso de errores durante el despliegue.

A continuación se proporciona la URL para ver el proyecto en Vercel: https://proyecto-m4-lucia-lemes.vercel.app

[⬆ Volver al inicio](#proyecto-integrador-4)

## Documentación de IA
En el siguiente markdown se proporciona la información de la IA utilizada. [Enlace a la documentación de IA](/DOCIA.md)