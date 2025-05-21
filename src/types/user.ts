
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  status: 'pending' | 'active';
  createdAt: Date;
  accessLevel: string;
  password?: string; // Add optional password property for password updates
}
