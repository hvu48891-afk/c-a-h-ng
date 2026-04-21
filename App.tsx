import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TableView from './components/TableView';
import MenuView from './components/MenuView';
import SettingsView from './components/SettingsView';
import OrderModal from './components/OrderModal';
import InvoiceModal from './components/InvoiceModal';
import AttendancePayrollView from './components/AttendancePayrollView';
import Login from './components/Login';
import { cn } from './lib/utils';
import { Table, Dish, Order, OrderItem, User, Attendance, Payroll } from './types';
import { Lock, Printer } from 'lucide-react';
import { INITIAL_TABLES, INITIAL_DISHES, INITIAL_ORDERS } from './mockData';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tables' | 'menu' | 'orders' | 'settings' | 'payroll'>('dashboard');
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [dishes, setDishes] = useState<Dish[]>(INITIAL_DISHES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('resto_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // If staff, default to tables
      if (parsedUser.role === 'STAFF') setActiveTab('tables');
    }

    const savedUsers = localStorage.getItem('resto_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Default mock users
      setUsers([
        { id: '1', username: 'admin', role: 'ADMIN', name: 'Quản trị viên', hourlyRate: 50000 },
        { id: '2', username: 'staff', role: 'STAFF', name: 'Nhân viên phục vụ', hourlyRate: 25000 }
      ]);
    }

    const savedTables = localStorage.getItem('resto_tables');
    const savedOrders = localStorage.getItem('resto_orders');
    const savedDishes = localStorage.getItem('resto_dishes');
    const savedAttendances = localStorage.getItem('resto_attendances');
    const savedPayrolls = localStorage.getItem('resto_payrolls');
    
    if (savedTables) setTables(JSON.parse(savedTables));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedDishes) setDishes(JSON.parse(savedDishes));
    if (savedAttendances) setAttendances(JSON.parse(savedAttendances));
    if (savedPayrolls) setPayrolls(JSON.parse(savedPayrolls));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('resto_user', JSON.stringify(user));
    else localStorage.removeItem('resto_user');
    
    localStorage.setItem('resto_users', JSON.stringify(users));
    localStorage.setItem('resto_tables', JSON.stringify(tables));
    localStorage.setItem('resto_orders', JSON.stringify(orders));
    localStorage.setItem('resto_dishes', JSON.stringify(dishes));
    localStorage.setItem('resto_attendances', JSON.stringify(attendances));
    localStorage.setItem('resto_payrolls', JSON.stringify(payrolls));
  }, [tables, orders, dishes, users, user, attendances, payrolls]);

  const handleTableClick = (table: Table) => {
    if (table.status === 'DIRTY') {
      handleCleanTable(table.id);
      return;
    }
    setSelectedTable(table);
  };

  const handleCleanTable = (tableId: string) => {
    setTables(prev => prev.map(t => 
      t.id === tableId ? { ...t, status: 'AVAILABLE' } : t
    ));
  };

  const handlePayOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'PAID', paidAt: new Date().toISOString() } : o
    ));

    setTables(prev => prev.map(t => 
      t.id === order.tableId ? { ...t, status: 'DIRTY', currentOrderId: undefined } : t
    ));

    // Show invoice after payment
    setSelectedInvoiceOrder(order);
  };

  const handleSaveOrder = (items: OrderItem[]) => {
    if (!selectedTable) return;

    const totalAmount = items.reduce((sum, item) => {
      const dish = dishes.find(d => d.id === item.dishId);
      return sum + (dish?.price || 0) * item.quantity;
    }, 0);

    if (selectedTable.status === 'OCCUPIED' && selectedTable.currentOrderId) {
      // Update existing order
      setOrders(prev => prev.map(o => 
        o.id === selectedTable.currentOrderId 
          ? { ...o, items, totalAmount } 
          : o
      ));
    } else {
      // Create new order
      const newOrder: Order = {
        id: uuidv4(),
        tableId: selectedTable.id,
        items,
        status: 'PENDING',
        totalAmount,
        createdAt: new Date().toISOString(),
      };

      setOrders(prev => [...prev, newOrder]);
      setTables(prev => prev.map(t => 
        t.id === selectedTable.id 
          ? { ...t, status: 'OCCUPIED', currentOrderId: newOrder.id } 
          : t
      ));
    }
    setSelectedTable(null);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('tables');
  };

  const renderContent = () => {
    if (!user) return null;

    switch (activeTab) {
      case 'dashboard':
        if (user.role !== 'ADMIN') {
          return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-20">
              <Lock size={64} className="mb-4 opacity-20" />
              <h2 className="text-xl font-bold">Bạn không có quyền truy cập trang này</h2>
              <p>Vui lòng liên hệ quản trị viên để biết thêm chi tiết.</p>
            </div>
          );
        }
        return <Dashboard tables={tables} orders={orders} dishes={dishes} />;
      case 'tables':
        return <TableView tables={tables} onTableClick={handleTableClick} />;
      case 'menu':
        return <MenuView dishes={dishes} setDishes={setDishes} user={user} />;
      case 'orders':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Danh sách đơn hàng</h2>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mã đơn</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bàn</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thời gian</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-gray-600">#{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">Bàn {tables.find(t => t.id === order.tableId)?.number}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{new Date(order.createdAt).toLocaleTimeString()}</td>
                      <td className="px-6 py-4 font-black text-gray-900">{new Intl.NumberFormat('vi-VN').format(order.totalAmount)}đ</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold",
                          order.status === 'PAID' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {order.status === 'PAID' ? 'Đã thanh toán' : order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {order.status !== 'PAID' && (
                            <button 
                              onClick={() => handlePayOrder(order.id)}
                              className="text-brand-primary font-bold text-sm hover:underline"
                            >
                              Thanh toán
                            </button>
                          )}
                          <button 
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-brand-primary transition-colors"
                            title="In hóa đơn"
                          >
                            <Printer size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'settings':
        if (user.role !== 'ADMIN') {
          return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-20">
              <Lock size={64} className="mb-4 opacity-20" />
              <h2 className="text-xl font-bold">Bạn không có quyền truy cập trang này</h2>
            </div>
          );
        }
        return (
          <SettingsView 
            tables={tables} 
            setTables={setTables} 
            dishes={dishes} 
            setDishes={setDishes} 
            users={users}
            setUsers={setUsers}
            currentUser={user}
          />
        );
      case 'payroll':
        return (
          <AttendancePayrollView
            user={user}
            users={users}
            attendances={attendances}
            setAttendances={setAttendances}
            payrolls={payrolls}
            setPayrolls={setPayrolls}
          />
        );
      default:
        return <div className="p-8 text-center text-gray-500">Đang phát triển...</div>;
    }
  };

  if (!user) {
    return (
      <Login 
        onLogin={setUser} 
        users={users} 
        onRegister={(newUser) => setUsers(prev => [...prev, newUser])} 
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-brand-bg">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto max-h-screen">
        {renderContent()}
      </main>

      {selectedTable && (
        <OrderModal
          table={selectedTable}
          dishes={dishes}
          currentOrder={orders.find(o => o.id === selectedTable.currentOrderId)}
          onClose={() => setSelectedTable(null)}
          onSave={handleSaveOrder}
          onPay={handlePayOrder}
        />
      )}

      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          table={tables.find(t => t.id === selectedInvoiceOrder.tableId)}
          dishes={dishes}
          user={user}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
};

export default App;
