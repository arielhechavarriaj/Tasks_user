import { User } from './entities.interface';
export interface LoginResponse {
  user:  User;
  token: string;
}

