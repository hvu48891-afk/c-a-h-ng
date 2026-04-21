import React, { useState } from 'react';
import { 
  Store, 
  Table as TableIcon, 
  Utensils, 
  Bell, 
  ShieldCheck, 
  Globe, 
  Coins,
  Save,
  Plus,
  Trash2,
  Users
} from 'lucide-react';
import { Table, Dish, User, UserRole } from '../types';
import { cn } from '../lib/utils';

interface SettingsViewProps {
  tables: Table[];
  setTables: React.Dispatch<React.SetStateAction<Table[]>>;
  dishes: Dish[];
  setDishes: React.Dispatch<React.SetStateAction<Dish[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  tables, 
  setTables, 
  dishes, 
  setDishes,
  users,
  setUsers,
  currentUser
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'restaurant' | 'tables' | 'system' | 'users'>('restaurant');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', role: 'STAFF' as UserRole, hourlyRate: 25000 });
  
  // Restaurant Info State
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: 'RestoMaster Premium',
    address: '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
    phone: '028 3829 1234',
    email: 'contact@restomaster.vn',
    openingTime: '08:00',
    closingTime: '22:00'
  });

  const handleAddTable = () => {
    const newTable: Table = {
      id: Math.random().toString(36).substr(2, 9),
      number: tables.length + 1,
      capacity: 4,
      status: 'AVAILABLE'
    };
    setTables([...tables, newTable]);
  };

  const handleDeleteTable = (id: string) => {
    setTables(tables.filter(t => t.id !== id));
  };

  const renderRestaurantSettings = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Tên nhà hàng</label>
          <input 
            type="text" 
            value={restaurantInfo.name}
            onChange={(e) => setRestaurantInfo({...restaurantInfo, name: e.target.value})}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Số điện thoại</label>
          <input 
            type="text" 
            value={restaurantInfo.phone}
            onChange={(e) => setRestaurantInfo({...restaurantInfo, phone: e.target.value})}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700">Địa chỉ</label>
          <input 
            type="text" 
            value={restaurantInfo.address}
            onChange={(e) => setRestaurantInfo({...restaurantInfo, address: e.target.value})}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Giờ mở cửa</label>
          <input 
            type="time" 
            value={restaurantInfo.openingTime}
            onChange={(e) => setRestaurantInfo({...restaurantInfo, openingTime: e.target.value})}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Giờ đóng cửa</label>
          <input 
            type="time" 
            value={restaurantInfo.closingTime}
            onChange={(e) => setRestaurantInfo({...restaurantInfo, closingTime: e.target.value})}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">
          <Save size={20} />
          Lưu thay đổi
        </button>
      </div>
    </div>
  );

  const renderTableSettings = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Danh sách bàn ăn ({tables.length})</h3>
        <button 
          onClick={handleAddTable}
          className="bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-primary hover:text-white transition-all"
        >
          <Plus size={18} />
          Thêm bàn
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <div key={table.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center group">
            <div>
              <p className="font-bold text-gray-900 text-lg">Bàn #{table.number}</p>
              <p className="text-sm text-gray-500">Sức chứa: {table.capacity} người</p>
            </div>
            <button 
              onClick={() => handleDeleteTable(table.id)}
              className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
          <div className="flex items-center gap-3 text-brand-primary mb-2">
            <Coins size={24} />
            <h4 className="font-bold text-gray-900">Tiền tệ & Thanh toán</h4>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Đơn vị tiền tệ</span>
              <select className="bg-gray-50 border-none rounded-lg px-3 py-1.5 font-bold text-gray-900">
                <option>VNĐ (₫)</option>
                <option>USD ($)</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">VAT (%)</span>
              <input type="number" defaultValue={8} className="w-16 bg-gray-50 border-none rounded-lg px-3 py-1.5 font-bold text-gray-900 text-right" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
          <div className="flex items-center gap-3 text-brand-primary mb-2">
            <Globe size={24} />
            <h4 className="font-bold text-gray-900">Ngôn ngữ & Vùng</h4>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ngôn ngữ hiển thị</span>
              <select className="bg-gray-50 border-none rounded-lg px-3 py-1.5 font-bold text-gray-900">
                <option>Tiếng Việt</option>
                <option>English</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Múi giờ</span>
              <span className="font-bold text-gray-900">GMT+7 (Hanoi)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Danh sách nhân sự ({users.length})</h3>
        <button 
          onClick={() => setIsAddingUser(true)}
          className="bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-primary hover:text-white transition-all"
        >
          <Plus size={18} />
          Thêm nhân viên
        </button>
      </div>
      
      {isAddingUser && (
        <div className="bg-white p-6 rounded-2xl border-2 border-brand-primary/20 space-y-4 animate-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-gray-900">Thêm nhân viên mới</h4>
            <button onClick={() => setIsAddingUser(false)} className="text-gray-400 hover:text-gray-600">
              <Trash2 size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Họ tên</label>
              <input 
                type="text" 
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Tên đăng nhập</label>
              <input 
                type="text" 
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                placeholder="user123"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Vai trò</label>
              <select 
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 outline-none"
              >
                <option value="STAFF">Nhân viên</option>
                <option value="ADMIN">Quản trị viên</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Lương/giờ</label>
              <input 
                type="number" 
                value={newUser.hourlyRate}
                onChange={(e) => setNewUser({...newUser, hourlyRate: Number(e.target.value)})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setIsAddingUser(false)}
              className="px-4 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
            >
              Hủy
            </button>
            <button 
              onClick={() => {
                if (!newUser.name || !newUser.username) return;
                const userToAdd: User = {
                  id: Math.random().toString(36).substr(2, 9),
                  ...newUser
                };
                setUsers([...users, userToAdd]);
                setIsAddingUser(false);
                setNewUser({ name: '', username: '', role: 'STAFF', hourlyRate: 25000 });
              }}
              className="bg-brand-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-100"
            >
              Xác nhận thêm
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Họ tên</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tên đăng nhập</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vai trò</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lương/giờ</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-900">{user.name} {user.id === currentUser.id && "(Bạn)"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{user.username}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    user.role === 'ADMIN' ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {user.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <input 
                    type="number"
                    value={user.hourlyRate || 0}
                    onChange={(e) => {
                      const newRate = Number(e.target.value);
                      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, hourlyRate: newRate } : u));
                    }}
                    className="w-24 bg-gray-50 border-none rounded-lg px-2 py-1 font-bold text-gray-900 text-sm"
                  />
                  <span className="text-xs text-gray-400 ml-1">đ/h</span>
                </td>
                <td className="px-6 py-4 text-right">
                  {user.id !== currentUser.id && (
                    <button 
                      onClick={() => setUsers(prev => prev.filter(u => u.id !== user.id))}
                      className="text-gray-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Cài đặt hệ thống</h2>
        <p className="text-gray-500">Tùy chỉnh cấu hình nhà hàng và các thông số vận hành.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1">
          <button 
            onClick={() => setActiveSubTab('restaurant')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
              activeSubTab === 'restaurant' ? "bg-brand-primary text-white shadow-lg shadow-rose-100" : "text-gray-500 hover:bg-white"
            )}
          >
            <Store size={20} />
            Thông tin nhà hàng
          </button>
          <button 
            onClick={() => setActiveSubTab('tables')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
              activeSubTab === 'tables' ? "bg-brand-primary text-white shadow-lg shadow-rose-100" : "text-gray-500 hover:bg-white"
            )}
          >
            <TableIcon size={20} />
            Quản lý bàn ăn
          </button>
          <button 
            onClick={() => setActiveSubTab('system')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
              activeSubTab === 'system' ? "bg-brand-primary text-white shadow-lg shadow-rose-100" : "text-gray-500 hover:bg-white"
            )}
          >
            <ShieldCheck size={20} />
            Cấu hình hệ thống
          </button>
          <button 
            onClick={() => setActiveSubTab('users')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
              activeSubTab === 'users' ? "bg-brand-primary text-white shadow-lg shadow-rose-100" : "text-gray-500 hover:bg-white"
            )}
          >
            <Users size={20} />
            Quản lý nhân sự
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeSubTab === 'restaurant' && renderRestaurantSettings()}
          {activeSubTab === 'tables' && renderTableSettings()}
          {activeSubTab === 'system' && renderSystemSettings()}
          {activeSubTab === 'users' && renderUserManagement()}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
