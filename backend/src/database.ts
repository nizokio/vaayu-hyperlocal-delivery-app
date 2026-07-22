import fs from 'fs';
import path from 'path';
import { User, Order } from './models';

const DB_PATH = path.join(__dirname, '../../db.json');

interface DatabaseSchema {
  users: User[];
  orders: Order[];
}

function initDb(): DatabaseSchema {
  if (!fs.existsSync(DB_PATH)) {
    const defaultData: DatabaseSchema = { users: [], orders: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    const defaultData: DatabaseSchema = { users: [], orders: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
}

export const db = {
  getUsers(): User[] {
    const data = initDb();
    return data.users;
  },

  getUserByEmail(email: string): User | undefined {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  addUser(user: User): void {
    const data = initDb();
    const exists = data.users.some(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (!exists) {
      data.users.push(user);
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    }
  },

  getOrders(): Order[] {
    const data = initDb();
    return data.orders;
  },

  addOrder(order: Order): void {
    const data = initDb();
    data.orders.push(order);
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  },

  updateOrderStatus(orderId: string, status: Order['status']): Order | undefined {
    const data = initDb();
    const orderIndex = data.orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      data.orders[orderIndex].status = status;
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
      return data.orders[orderIndex];
    }
    return undefined;
  }
};
