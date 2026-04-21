import React, { useState, useEffect } from 'react';
import { X, Upload, Check, AlertCircle, Trash2 } from 'lucide-react';
import { Dish, DishCategory } from '../types';
import { cn } from '../lib/utils';

interface DishModalProps {
  dish?: Dish;
  onClose: () => void;
  onSave: (dish: Dish) => void;
  onDelete?: (id: string) => void;
}

const DishModal: React.FC<DishModalProps> = ({ dish, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState<Omit<Dish, 'id'>>({
    name: dish?.name || '',
    price: dish?.price || 0,
    category: dish?.category || 'MAIN_COURSE',
    image: dish?.image || 'https://picsum.photos/seed/food/800/600',
    isAvailable: dish?.isAvailable ?? true,
  });

  const categories: { id: DishCategory; label: string }[] = [
    { id: 'APPETIZER', label: 'Khai vị' },
    { id: 'MAIN_COURSE', label: 'Món chính' },
    { id: 'DESSERT', label: 'Tráng miệng' },
    { id: 'DRINK', label: 'Đồ uống' },
    { id: 'SIDE_DISH', label: 'Món phụ' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: dish?.id || Math.random().toString(36).substr(2, 9),
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {dish ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Tên món ăn</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-primary transition-all font-medium"
                placeholder="Nhập tên món..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Giá (VNĐ)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-primary transition-all font-medium"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Danh mục</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as DishCategory })}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-primary transition-all font-medium appearance-none"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Link hình ảnh</label>
              <div className="flex gap-4">
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="flex-1 bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-primary transition-all font-medium"
                  placeholder="https://..."
                />
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
              />
              <label htmlFor="isAvailable" className="text-sm font-bold text-gray-700 cursor-pointer">
                Sẵn sàng phục vụ
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            {dish && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Bạn có chắc chắn muốn xóa món ăn này?')) {
                    onDelete(dish.id);
                  }
                }}
                className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all"
                title="Xóa món ăn"
              >
                <Trash2 size={24} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 bg-brand-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
            >
              <Check size={20} />
              {dish ? 'Lưu thay đổi' : 'Thêm món ăn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DishModal;
