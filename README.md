# SCO - Nestjs Utilities

Nestjs Utilities es una librería de Node.js desarrollada para el framework Nestjs y publicada en NPM. 
Esta librería proporciona una serie de funciones y servicios útiles para simplificar el desarrollo de aplicaciones web con Nestjs,.
También, la librería provee de una sólida base de autentificación JWT con una gestión de usuarios.

# Instalación
<pre>
npm i sco-backend-fw-core
</pre>

# Características principales

- Authmodule (Modulo de autentificación de usuarios)
  - AuthRepository
  - AuthService
  - AuthController
  - AuthConfig
  - LoginDto
  - TokenDto
  - JwtPayload
  - AuthStrategy
- Constants
  - HTTP_ERROR_CONSTANTS
  - VALIDATION_ERROR_CONSTANTS
- EmailerModule
  - EmailerRepository
  - EmailerService
  - EmailerController
  - EmailerControllerJwt
  - EmailerConfig
  - MessageDto
- ExcelModule
  - ExcelRepository
  - ExcelService
  - ExcelController
  - ExcelControllerJwt
  - ExcelConfig
  - ExcelDto
  - ExcelExtensionEnum
- LoggerModule (Tratamiento de ficheros de logs)
  - LoggerService
- MicroserviceConnectionModule
  - MicroserviceConnectionService
  - MicroserviceConnectionConfig
  - MicroserviceToBackend
- Middlewares
  - PublicMiddleware
- MongoDbModule
  - MongoDbService
  - MongoDbConfig
  - MONGODB_CONSTANTS
- PaginationModule
  - PaginationService
  - PaginationDto
  - PAGINATION_CONSTANTS
- PermissionsModule (Permisos de los roles)
  - PermissionsRepository
  - PermissionsService
  - PermissionsController
  - PermissionsControllerJwt
  - PermissionsConfig
  - PERMISSIONS_CONSTANTS
  - PermissionDto
  - IPermission
  - PERMISSIONS_SCHEMA
- PopulateModule
  - PopulateService
  - PopualteConfig
- RolesModule (Roles de los usuarios)
  - RolesRepository
  - RolesService
  - RolesController
  - RolesControllerJwt
  - RolesConfig
  - ROLES_CONSTANTS
  - RoleDto
  - IRole
  - ROLES_SCHEMA
- SftpModule
  - SftpRepository
  - SftpService
  - SftpController
  - SftpControllerJwt
  - SftpConfig
  - SftpRequestDto
- SharedModule
  - BcryptService
  - ControllerService
  - TranslateService
    - TRANSLATE_CONSTANTS
- UsersModule
  - UsersRepository
  - UsersService
  - UsersController
  - UsersControllerJwt
  - UsersConfig
  - USERS_CONSTANTS
  - UserDto
  - UpdateUserDto
  - IUser
  - USERS_SCHEMA
- WebsocketModule
  - WebsocketGateway
  - WebsocketConfig
  - WebsocketAdapter
  - WEBSOCKET_EVENTS

# Parámetros de configuración
<pre>
LoggerModule,
PaginationModule,
SharedModule,
MongoDbModule.register({
  ip: 'localhost',
  port: 27017,
  database: 'sco-backend-fw-core'
}),
WebsocketModule.register({
  port: 8070,
  origin: 'http://localhost, http://localhost:8070',
}),
MicroserviceConnectionModule.register({
  enabled: false,
  host: '0.0.0.0',
  port: 3006,
}),
AuthModule.register({
  secret: 'qu3Ric0Est4ElCachop025!',
  signOptions: {
    expiresIn: '365d'
  },
  algorithm: 'HS256',
  newUserActived: false,
}),
EmailerModule.register({
  jwtController: true || false,
  sending_Email_Address: 'youremail@email.com',
  sending_Email_Password: 'yourPasswordEmail',
  service: 'gmail' || 'hotmail',
}),
ExcelModule.register({
  jwtController: true || false,
}),
SftpModule.register({
  jwtController: true || false,
  host: 'X.X.X.X',
  port: 22,
  username: 'user',
  password: 'userPassword'
}),
PermissionsModule.register({
  jwtController: true || false,
}),
RolesModule.register({
  jwtController: true || false,
}),
UsersModule.register({
  jwtController: true || false,
  newUserActived: true,
}),

/* Always Last Module On Load */
PopulateModule.register({
  populate: true,
})
</pre>

# Ejemplo
- http://scoapps.es:8000/doc
- Admin // Admin123456!
- Public // Public123456!

# Changelog
9.1.1/13:
- Initial versión

9.1.14:
- Delete auth service useless console log
- Delete http error constants not used
- Refactor excel módule
- Add createdAt & updatedAt to permission dto

9.1.15:
- ADD Users role validation
- ADD Roles permissions validation
- ADD createdAt & updatedAt to user & role dto

9.1.16:
- ADD createdAt & updatedAt properties to iUser, iRole, iPermission
- ADD createdAt & updatedAt to modelToDto functions in users, roles, permissions

9.1.17:
- Fix Websocket external library websocket event notification

9.1.18:
- Fix Roledto import error of PermissionDto

9.1.19:
- UPD names of users, roles & permissions schemas constants