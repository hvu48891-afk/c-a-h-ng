import { Table, Dish, Order } from './types';

export const INITIAL_TABLES: Table[] = [
  { id: 't1', number: 1, capacity: 2, status: 'AVAILABLE' },
  { id: 't2', number: 2, capacity: 2, status: 'OCCUPIED', currentOrderId: 'o1' },
  { id: 't3', number: 3, capacity: 4, status: 'AVAILABLE' },
  { id: 't4', number: 4, capacity: 4, status: 'RESERVED' },
  { id: 't5', number: 5, capacity: 6, status: 'AVAILABLE' },
  { id: 't6', number: 6, capacity: 2, status: 'DIRTY' },
  { id: 't7', number: 7, capacity: 4, status: 'AVAILABLE' },
  { id: 't8', number: 8, capacity: 8, status: 'AVAILABLE' },
];

export const INITIAL_DISHES: Dish[] = [
  { id: 'd1', name: 'Phở Bò', price: 65000, category: 'MAIN_COURSE', image: 'https://picsum.photos/seed/pho/200/200', isAvailable: true },
  { id: 'd2', name: 'Gỏi Cuốn', price: 45000, category: 'APPETIZER', image: 'https://picsum.photos/seed/goicuon/200/200', isAvailable: true },
  { id: 'd3', name: 'Bún Chả', price: 55000, category: 'MAIN_COURSE', image: 'https://picsum.photos/seed/buncha/200/200', isAvailable: true },
  { id: 'd4', name: 'Cà Phê Sữa Đá', price: 25000, category: 'DRINK', image: 'https://picsum.photos/seed/coffee/200/200', isAvailable: true },
  { id: 'd5', name: 'Chè Thái', price: 35000, category: 'DESSERT', image: 'https://picsum.photos/seed/chethai/200/200', isAvailable: true },
  { id: 'd6', name: 'Bánh Mì Thịt', price: 30000, category: 'MAIN_COURSE', image: 'https://picsum.photos/seed/banhmi/200/200', isAvailable: true },
  { id: 'd7', name: 'Trà Đá', price: 5000, category: 'DRINK', image: 'https://picsum.photos/seed/icetea/200/200', isAvailable: true },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'o1',
    tableId: 't2',
    items: [
      { dishId: 'd1', quantity: 2 },
      { dishId: 'd4', quantity: 2 },
    ],
    status: 'PREPARING',
    totalAmount: 180000,
    createdAt: new Date().toISOString(),
  }
];
