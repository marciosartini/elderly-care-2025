
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  status: 'pending' | 'active';
  createdAt: Date;
  accessLevel?: 'basic' | 'full' | 'limited';
  password?: string; // Add password as an optional property
}

export type UserWithPassword = User & {
  password: string;
};

