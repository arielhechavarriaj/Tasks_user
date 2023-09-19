export interface RegisterResponse {
  message: StatusRegister;
}

export enum StatusRegister {
  created = 'Usuario creado con exito',
  notcreated = 'El usuario ya existe en el sistema',
}
