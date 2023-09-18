import { User } from './entities.interface';

export interface CheckTokenResponse {
  user:  User;
  token: string;
}
export interface RegisterResponse {
  message: StatusRegister ;
}

export enum StatusRegister {
  created="Usuario creado con exito",
  notcreated="El usuario ya existe en el sistema"

}
