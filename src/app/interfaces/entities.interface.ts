export interface User {
  email: string;
  name: string;
  password: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  created_date: string;
  expire_date: string;
  status: StatusTask;
}

export enum StatusTask {
  created = 'Creado',
  inProgress = 'En Progreso',
  done = 'Terminado',
  incomplete = 'No Completado',
}

export enum StatusRegister {
  created = 'created',
  notCreated = 'notCreated',
}
