import React from 'react';
import { Table } from '../types';
import { cn } from '../lib/utils';
import { Users } from 'lucide-react';

interface TableViewProps {
  tables: Table[];
  onTableClick: (table: Table) => void;
}

const TableView: React.FC<TableViewProps> = ({ tables, onTableClick }) => {
  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'OCCUPIED': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'RESERVED': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DIRTY': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: Table['status']) => {
    switch (status) {
      case 'AVAILABLE': return 'Trống';
      case 'OCCUPIED': return 'Đang dùng';
      case 'RESERVED': return 'Đã đặt';
      case 'DIRTY': return 'Chưa dọn';
      default: return status;
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sơ đồ bàn</h2>
          <p className="text-gray-500">Quản lý trạng thái bàn và gọi món</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm text-gray-600">Trống</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <span className="text-sm text-gray-600">Đang dùng</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-sm text-gray-600">Đã đặt</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => onTableClick(table)}
            className={cn(
              "relative p-6 rounded-2xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-xl text-left group",
              getStatusColor(table.status),
              "border-transparent hover:border-current"
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl font-black opacity-20 group-hover:opacity-40 transition-opacity">
                #{table.number}
              </span>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <Users size={16} />
                {table.capacity}
              </div>
            </div>
            
            <div className="mt-auto flex justify-between items-end">
              <div>
                <p className="text-xs uppercase tracking-wider font-bold opacity-60 mb-1">Trạng thái</p>
                <p className="font-bold text-lg">{getStatusLabel(table.status)}</p>
              </div>
              {table.status === 'DIRTY' && (
                <div className="bg-brand-primary text-white text-[10px] font-bold px-2 py-1 rounded-lg animate-bounce">
                  Click để dọn
                </div>
              )}
            </div>

            {table.currentOrderId && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TableView;
