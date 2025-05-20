
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  status: 'pending' | 'active';
  createdAt: Date;
  accessLevel?: 'basic' | 'full' | 'limited';
}

export type UserWithPassword = Omit<User, 'id' | 'createdAt'> & {
  password?: string;
};
