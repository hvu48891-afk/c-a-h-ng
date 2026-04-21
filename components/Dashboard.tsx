import React from 'react';
import { cn } from '../lib/utils';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Thứ 2', revenue: 4500000 },
  { name: 'Thứ 3', revenue: 5200000 },
  { name: 'Thứ 4', revenue: 4800000 },
  { name: 'Thứ 5', revenue: 6100000 },
  { name: 'Thứ 6', revenue: 8500000 },
  { name: 'Thứ 7', revenue: 12000000 },
  { name: 'Chủ nhật', revenue: 10500000 },
];

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Doanh thu hôm nay', value: '8.500.000đ', icon: DollarSign, trend: '+12.5%', trendUp: true, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Đơn hàng mới', value: '42', icon: ShoppingBag, trend: '+5.2%', trendUp: true, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Khách hàng', value: '128', icon: Users, trend: '-2.4%', trendUp: false, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Tỷ lệ lấp đầy', value: '85%', icon: TrendingUp, trend: '+8.1%', trendUp: true, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Tổng quan</h2>
        <p className="text-gray-500">Chào mừng trở lại, đây là tình hình kinh doanh hôm nay.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-sm font-bold",
                stat.trendUp ? "text-emerald-600" : "text-rose-600"
              )}>
                {stat.trend}
                {stat.trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Doanh thu tuần này</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `${value/1000000}M`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [new Intl.NumberFormat('vi-VN').format(value) + 'đ', 'Doanh thu']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Món ăn bán chạy</h3>
          <div className="space-y-6">
            {[
              { name: 'Phở Bò Đặc Biệt', count: 145, revenue: '9.425.000đ', progress: 85 },
              { name: 'Bún Chả Hà Nội', count: 122, revenue: '6.710.000đ', progress: 72 },
              { name: 'Gỏi Cuốn Tôm Thịt', count: 98, revenue: '4.410.000đ', progress: 58 },
              { name: 'Cà Phê Sữa Đá', count: 86, revenue: '2.150.000đ', progress: 45 },
            ].map((dish, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-bold text-gray-900">{dish.name}</p>
                    <p className="text-xs text-gray-500">{dish.count} đơn hàng</p>
                  </div>
                  <p className="font-bold text-gray-900">{dish.revenue}</p>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-primary h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${dish.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
