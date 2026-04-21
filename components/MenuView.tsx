import React, { useState } from 'react';
import { Table, Dish, Order, OrderItem, User, DishCategory } from '../types';
import { Search, Plus, Filter, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import DishModal from './DishModal';

interface MenuViewProps {
  dishes: Dish[];
  setDishes: React.Dispatch<React.SetStateAction<Dish[]>>;
  user: User;
}

const MenuView: React.FC<MenuViewProps> = ({ dishes, setDishes, user }) => {
  const [activeCategory, setActiveCategory] = useState<DishCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | undefined>(undefined);

  const isAdmin = user.role === 'ADMIN';

  const categories: { id: DishCategory | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'APPETIZER', label: 'Khai vị' },
    { id: 'MAIN_COURSE', label: 'Món chính' },
    { id: 'DESSERT', label: 'Tráng miệng' },
    { id: 'DRINK', label: 'Đồ uống' },
    { id: 'SIDE_DISH', label: 'Món phụ' },
  ];

  const handleSaveDish = (dish: Dish) => {
    if (editingDish) {
      setDishes(prev => prev.map(d => d.id === dish.id ? dish : d));
    } else {
      setDishes(prev => [...prev, dish]);
    }
    setIsModalOpen(false);
    setEditingDish(undefined);
  };

  const handleEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setIsModalOpen(true);
  };

  const handleAddDish = () => {
    setEditingDish(undefined);
    setIsModalOpen(true);
  };

  const handleDeleteDish = (id: string) => {
    setDishes(prev => prev.filter(d => d.id !== id));
    setIsModalOpen(false);
    setEditingDish(undefined);
  };

  const filteredDishes = dishes.filter(dish => {
    const matchesCategory = activeCategory === 'ALL' || dish.category === activeCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Thực đơn</h2>
          <p className="text-gray-500">Quản lý món ăn và giá cả</p>
        </div>
        {isAdmin && (
          <button 
            onClick={handleAddDish}
            className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100"
          >
            <Plus size={20} />
            Thêm món mới
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm món ăn..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all",
                activeCategory === cat.id
                  ? "bg-brand-primary text-white shadow-md shadow-rose-100"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-brand-primary hover:text-brand-primary"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDishes.map((dish) => (
          <div key={dish.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow group">
            <div className="relative h-48 overflow-hidden">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3">
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                  dish.isAvailable ? "bg-emerald-500 text-white" : "bg-gray-500 text-white"
                )}>
                  {dish.isAvailable ? 'Sẵn sàng' : 'Hết hàng'}
                </span>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-1">{dish.category}</p>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{dish.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-xl font-black text-gray-900">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dish.price)}
                </span>
                {isAdmin && (
                  <button 
                    onClick={() => handleEditDish(dish)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-primary transition-colors"
                  >
                    <Settings size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <DishModal
          dish={editingDish}
          onClose={() => {
            setIsModalOpen(false);
            setEditingDish(undefined);
          }}
          onSave={handleSaveDish}
          onDelete={handleDeleteDish}
        />
      )}
    </div>
  );
};

export default MenuView;
