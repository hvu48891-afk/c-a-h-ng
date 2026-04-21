import React from 'react';
import { X, Printer, ChefHat } from 'lucide-react';
import { Order, Table, Dish, User } from '../types';

interface InvoiceModalProps {
  order: Order;
  table?: Table;
  dishes: Dish[];
  user: User;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, table, dishes, user, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const getDishName = (dishId: string) => {
    return dishes.find(d => d.id === dishId)?.name || 'Món đã xóa';
  };

  const getDishPrice = (dishId: string) => {
    return dishes.find(d => d.id === dishId)?.price || 0;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:p-0 print:bg-white print:static print:block">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300 print:shadow-none print:rounded-none print:max-w-none print:h-auto print:w-full print-container">
        {/* Header - Hidden on print */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white print:hidden">
          <h2 className="text-xl font-bold text-gray-900">Hóa đơn thanh toán</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 rounded-full text-brand-primary transition-colors"
              title="In hóa đơn"
            >
              <Printer size={24} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 print:overflow-visible print:p-4">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg rotate-3 print:shadow-none">
              <ChefHat size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">RestoMaster</h1>
            <p className="text-sm text-gray-500">123 Đường Lê Lợi, Quận 1, TP. HCM</p>
            <p className="text-sm text-gray-500">SĐT: 028 3829 1234</p>
          </div>

          <div className="border-t border-b border-dashed border-gray-200 py-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Số hóa đơn:</span>
              <span className="font-bold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Bàn:</span>
              <span className="font-bold text-gray-900">{table ? `Bàn #${table.number}` : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ngày:</span>
              <span className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Giờ vào:</span>
              <span className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleTimeString('vi-VN')}</span>
            </div>
            {order.paidAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">Giờ thanh toán:</span>
                <span className="font-bold text-gray-900">{new Date(order.paidAt).toLocaleTimeString('vi-VN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Thu ngân:</span>
              <span className="font-bold text-gray-900">{user.name}</span>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 font-bold text-gray-900">Món ăn</th>
                <th className="text-center py-2 font-bold text-gray-900">SL</th>
                <th className="text-right py-2 font-bold text-gray-900">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="py-3 text-gray-900">{getDishName(item.dishId)}</td>
                  <td className="py-3 text-center text-gray-900">{item.quantity}</td>
                  <td className="py-3 text-right font-medium text-gray-900">
                    {new Intl.NumberFormat('vi-VN').format(getDishPrice(item.dishId) * item.quantity)}đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tạm tính:</span>
              <span className="text-gray-900 font-medium">{new Intl.NumberFormat('vi-VN').format(order.totalAmount)}đ</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">VAT (8%):</span>
              <span className="text-gray-900 font-medium">{new Intl.NumberFormat('vi-VN').format(order.totalAmount * 0.08)}đ</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
              <span className="text-lg font-bold text-gray-900">TỔNG CỘNG:</span>
              <span className="text-2xl font-black text-rose-600">
                {new Intl.NumberFormat('vi-VN').format(order.totalAmount * 1.08)}đ
              </span>
            </div>
          </div>

          <div className="text-center pt-8 pb-4 space-y-1">
            <p className="text-sm font-bold text-gray-900">Cảm ơn Quý khách!</p>
            <p className="text-xs text-gray-400 italic">Hẹn gặp lại Quý khách lần sau</p>
          </div>
        </div>

        {/* Footer Actions - Hidden on print */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3 print:hidden">
          <button
            onClick={onClose}
            className="flex-1 bg-white border border-gray-200 text-gray-600 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-all"
          >
            Đóng
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 bg-brand-primary text-white py-3 rounded-2xl font-bold shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
          >
            <Printer size={20} />
            In hóa đơn
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
