export type UserRole = 'ADMIN' | 'STAFF';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  hourlyRate?: number;
}

export interface Attendance {
  id: string;
  userId: string;
  checkIn: string;
  checkOut?: string;
  totalHours?: number;
}

export interface Payroll {
  id: string;
  userId: string;
  amount: number;
  period: string; // e.g., "2026-03"
  paidAt: string;
  status: 'PAID' | 'PENDING';
}

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'DIRTY';

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
}

export type DishCategory = 'APPETIZER' | 'MAIN_COURSE' | 'DESSERT' | 'DRINK' | 'SIDE_DISH';

export interface Dish {
  id: string;
  name: string;
  price: number;
  category: DishCategory;
  image: string;
  isAvailable: boolean;
}

export interface OrderItem {
  dishId: string;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 'PENDING' | 'PREPARING' | 'SERVED' | 'PAID' | 'CANCELLED';

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  paidAt?: string;
}

export interface RestaurantStats {
  totalRevenue: number;
  totalOrders: number;
  popularDishes: { name: string; count: number }[];
  revenueByDay: { date: string; amount: number }[];
}
