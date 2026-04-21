import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { Table, Dish, OrderItem, DishCategory, Order } from '../types';
import { cn } from '../lib/utils';

interface OrderModalProps {
  table: Table;
  dishes: Dish[];
  currentOrder?: Order;
  onClose: () => void;
  onSave: (items: OrderItem[]) => void;
  onPay?: (orderId: string) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ table, dishes, currentOrder, onClose, onSave, onPay }) => {
  const [cart, setCart] = useState<OrderItem[]>(currentOrder ? currentOrder.items : []);
  const [activeCategory, setActiveCategory] = useState<DishCategory | 'ALL'>('ALL');

  const isOccupied = table.status === 'OCCUPIED';

  const categories: { id: DishCategory | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'APPETIZER', label: 'Khai vị' },
    { id: 'MAIN_COURSE', label: 'Món chính' },
    { id: 'DESSERT', label: 'Tráng miệng' },
    { id: 'DRINK', label: 'Đồ uống' },
  ];

  const addToCart = (dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(item => item.dishId === dish.id);
      if (existing) {
        return prev.map(item => 
          item.dishId === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { dishId: dish.id, quantity: 1 }];
    });
  };

  const removeFromCart = (dishId: string) => {
    setCart(prev => prev.filter(item => item.dishId !== dishId));
  };

  const updateQuantity = (dishId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.dishId === dishId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const filteredDishes = dishes.filter(d => activeCategory === 'ALL' || d.category === activeCategory);

  const total = cart.reduce((sum, item) => {
    const dish = dishes.find(d => d.id === item.dishId);
    return sum + (dish?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              {isOccupied ? `Đang phục vụ - Bàn #${table.number}` : `Gọi món - Bàn #${table.number}`}
            </h2>
            <p className="text-gray-500">Sức chứa: {table.capacity} người</p>
          </div>
          <div className="flex items-center gap-4">
            {isOccupied && currentOrder && onPay && (
              <button 
                onClick={() => {
                  onPay(currentOrder.id);
                  onClose();
                }}
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                Thanh toán & Trả bàn
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Menu Section */}
          <div className="flex-1 flex flex-col border-r border-gray-100 bg-gray-50/50">
            <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar bg-white border-b border-gray-100">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all",
                    activeCategory === cat.id
                      ? "bg-brand-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDishes.map(dish => (
                <button
                  key={dish.id}
                  onClick={() => addToCart(dish)}
                  disabled={!dish.isAvailable}
                  className={cn(
                    "bg-white p-4 rounded-2xl border border-gray-100 text-left hover:shadow-lg transition-all group relative",
                    !dish.isAvailable && "opacity-50 grayscale cursor-not-allowed"
                  )}
                >
                  <div className="flex gap-4">
                    <img src={dish.image} alt={dish.name} className="w-20 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-brand-primary uppercase tracking-tighter mb-1">{dish.category}</p>
                      <h4 className="font-bold text-gray-900 line-clamp-1">{dish.name}</h4>
                      <p className="text-lg font-black text-gray-900 mt-1">
                        {new Intl.NumberFormat('vi-VN').format(dish.price)}đ
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-brand-primary text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={16} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="w-96 flex flex-col bg-white">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-900 mb-1">
                <ShoppingCart size={20} />
                <h3 className="font-bold text-lg">Giỏ hàng</h3>
              </div>
              <p className="text-sm text-gray-500">{cart.length} món đã chọn</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                  <ShoppingCart size={48} className="mb-4 opacity-20" />
                  <p>Chưa có món nào trong giỏ</p>
                </div>
              ) : (
                cart.map(item => {
                  const dish = dishes.find(d => d.id === item.dishId);
                  if (!dish) return null;
                  return (
                    <div key={item.dishId} className="flex gap-4 items-center">
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-900 text-sm">{dish.name}</h5>
                        <p className="text-xs text-gray-500">{new Intl.NumberFormat('vi-VN').format(dish.price)}đ</p>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                        <button 
                          onClick={() => updateQuantity(item.dishId, -1)}
                          className="p-1 hover:bg-white rounded-lg transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.dishId, 1)}
                          className="p-1 hover:bg-white rounded-lg transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.dishId)}
                        className="text-gray-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 font-medium">Tổng cộng</span>
                <span className="text-2xl font-black text-gray-900">
                  {new Intl.NumberFormat('vi-VN').format(total)}đ
                </span>
              </div>
              <button
                disabled={cart.length === 0}
                onClick={() => onSave(cart)}
                className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                {isOccupied ? 'Cập nhật đơn hàng' : 'Xác nhận gọi món'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
