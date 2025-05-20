
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "pending" | "inactive";
  createdAt: string;
  accessLevel: "low" | "medium" | "high";
}

// Mock users data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "msartini@gmail.com",
    role: "admin",
    status: "active",
    createdAt: new Date().toISOString(),
    accessLevel: "high"
  },
];

export const usersStore = {
  users: [...mockUsers],

  getUsers: () => {
    return [...usersStore.users];
  },

  getUserById: (id: string) => {
    return usersStore.users.find((user) => user.id === id) || null;
  },

  getUserByEmail: (email: string) => {
    return usersStore.users.find((user) => user.email === email) || null;
  },

  addUser: (userData: Omit<User, "id" | "createdAt">) => {
    const newUser = {
      ...userData,
      id: (usersStore.users.length + 1).toString(),
      createdAt: new Date().toISOString(),
    };

    usersStore.users.push(newUser);
    return newUser;
  },

  updateUser: (id: string, userData: Partial<User>) => {
    const index = usersStore.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      usersStore.users[index] = {
        ...usersStore.users[index],
        ...userData,
      };
      return true;
    }
    return false;
  },

  deleteUser: (id: string) => {
    const index = usersStore.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      usersStore.users.splice(index, 1);
      return true;
    }
    return false;
  },

  changePassword: (id: string, newPassword: string) => {
    // In a real app, this would handle password hashing
    console.log(`Password changed for user ${id}: ${newPassword}`);
    return true;
  }
};
