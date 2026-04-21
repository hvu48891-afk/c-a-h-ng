import React from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Table as TableIcon, 
  ClipboardList, 
  Settings,
  LogOut,
  Wallet
} from 'lucide-react';
import { cn } from '../lib/utils';

import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard, roles: ['ADMIN'] },
    { id: 'tables', label: 'Sơ đồ bàn', icon: TableIcon, roles: ['ADMIN', 'STAFF'] },
    { id: 'menu', label: 'Thực đơn', icon: UtensilsCrossed, roles: ['ADMIN', 'STAFF'] },
    { id: 'orders', label: 'Đơn hàng', icon: ClipboardList, roles: ['ADMIN', 'STAFF'] },
    { id: 'payroll', label: 'Lương & Công', icon: Wallet, roles: ['ADMIN', 'STAFF'] },
    { id: 'settings', label: 'Cài đặt', icon: Settings, roles: ['ADMIN'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="w-64 bg-white border-r border-gray-100 h-screen flex flex-col sticky top-0 shadow-sm">
      <div className="p-6 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
            <UtensilsCrossed size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight italic">RestoMaster</h1>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 font-medium">{user.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-brand-primary text-white shadow-md shadow-rose-100" 
                : "text-gray-500 hover:bg-brand-bg hover:text-brand-primary"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-colors",
              activeTab === item.id ? "text-white" : "text-gray-400 group-hover:text-brand-primary"
            )} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
