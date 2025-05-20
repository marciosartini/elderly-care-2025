
import { v4 as uuidv4 } from 'uuid';
import { User, UserWithPassword } from '@/types/user';

// Sample admin user (would normally be stored in a database)
const adminUser: User = {
  id: '1',
  email: 'msartini@gmail.com',
  name: 'Administrador',
  role: 'admin',
  status: 'active',
  createdAt: new Date(),
  accessLevel: 'full',
};

// Initial users
const initialUsers: User[] = [adminUser];

// Mock password store - in a real app this would be hashed and stored securely
const userPasswords: Record<string, string> = {
  'msartini@gmail.com': '123456',
};

export const usersStore = {
  users: [...initialUsers],
  addUser: (user: UserWithPassword) => {
    // Check if email already exists
    const existingUser = usersStore.getUserByEmail(user.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
    
    const newUser: User = {
      ...user,
      id: uuidv4(),
      createdAt: new Date(),
    };
    
    // Store the password (in a real app this would be hashed)
    if ('password' in user && user.password) {
      userPasswords[user.email] = user.password as string;
    }
    
    usersStore.users.push(newUser);
    return newUser;
  },
  updateUser: (id: string, userData: Partial<User>) => {
    const index = usersStore.users.findIndex(user => user.id === id);
    if (index !== -1) {
      // Update user data
      usersStore.users[index] = { ...usersStore.users[index], ...userData };
      
      // Update password if provided
      if ('password' in userData && userData.password) {
        userPasswords[usersStore.users[index].email] = userData.password as string;
      }
      
      return true;
    }
    return false;
  },
  deleteUser: (id: string) => {
    const index = usersStore.users.findIndex(user => user.id === id);
    if (index !== -1) {
      // Remove password entry
      delete userPasswords[usersStore.users[index].email];
      
      // Remove user
      usersStore.users.splice(index, 1);
      return true;
    }
    return false;
  },
  getUserById: (id: string) => {
    return usersStore.users.find(user => user.id === id) || null;
  },
  getUserByEmail: (email: string) => {
    return usersStore.users.find(user => user.email === email) || null;
  },
  getUsers: () => {
    return [...usersStore.users];
  },
  checkPassword: (email: string, password: string) => {
    const storedPassword = userPasswords[email];
    return storedPassword && storedPassword === password;
  },
  updatePassword: (email: string, newPassword: string) => {
    if (usersStore.getUserByEmail(email)) {
      userPasswords[email] = newPassword;
      return true;
    }
    return false;
  }
};
