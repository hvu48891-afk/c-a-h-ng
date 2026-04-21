import React, { useState, useMemo } from 'react';
import { Clock, DollarSign, Calendar, CheckCircle, AlertCircle, User as UserIcon, Play, Square } from 'lucide-react';
import { User, Attendance, Payroll } from '../types';
import { cn } from '../lib/utils';

interface AttendancePayrollViewProps {
  user: User;
  users: User[];
  attendances: Attendance[];
  setAttendances: React.Dispatch<React.SetStateAction<Attendance[]>>;
  payrolls: Payroll[];
  setPayrolls: React.Dispatch<React.SetStateAction<Payroll[]>>;
}

const AttendancePayrollView: React.FC<AttendancePayrollViewProps> = ({
  user,
  users,
  attendances,
  setAttendances,
  payrolls,
  setPayrolls
}) => {
  const isAdmin = user.role === 'ADMIN';
  const [activeTab, setActiveTab] = useState<'attendance' | 'payroll'>(isAdmin ? 'payroll' : 'attendance');

  // Attendance Logic for current user
  const currentAttendance = useMemo(() => {
    return attendances.find(a => a.userId === user.id && !a.checkOut);
  }, [attendances, user.id]);

  const handleCheckIn = () => {
    const newAttendance: Attendance = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      checkIn: new Date().toISOString(),
    };
    setAttendances(prev => [...prev, newAttendance]);
  };

  const handleCheckOut = () => {
    if (!currentAttendance) return;
    const checkOutTime = new Date();
    const checkInTime = new Date(currentAttendance.checkIn);
    const hours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    
    setAttendances(prev => prev.map(a => 
      a.id === currentAttendance.id 
        ? { ...a, checkOut: checkOutTime.toISOString(), totalHours: Number(hours.toFixed(2)) } 
        : a
    ));
  };

  // Payroll Logic for Admin
  const calculateUnpaidSalary = (userId: string) => {
    const userAttendances = attendances.filter(a => a.userId === userId && a.checkOut && a.totalHours);
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser || !targetUser.hourlyRate) return 0;
    
    // Simple logic: sum all hours that haven't been paid yet
    // In a real app, we'd track which attendances are paid
    const totalHours = userAttendances.reduce((sum, a) => sum + (a.totalHours || 0), 0);
    return totalHours * targetUser.hourlyRate;
  };

  const handlePaySalary = (userId: string) => {
    const amount = calculateUnpaidSalary(userId);
    if (amount <= 0) return;

    const newPayroll: Payroll = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      amount,
      period: new Date().toISOString().slice(0, 7),
      paidAt: new Date().toISOString(),
      status: 'PAID'
    };

    setPayrolls(prev => [...prev, newPayroll]);
    // In a real app, we'd mark attendances as paid here
    alert(`Đã phát lương thành công cho ${users.find(u => u.id === userId)?.name}: ${new Intl.NumberFormat('vi-VN').format(amount)}đ`);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Lương & Chấm công</h2>
          <p className="text-gray-500">Quản lý thời gian làm việc và thu nhập</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
          {isAdmin && (
            <button 
              onClick={() => setActiveTab('payroll')}
              className={cn(
                "px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
                activeTab === 'payroll' ? "bg-brand-primary text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              Quản lý lương
            </button>
          )}
          <button 
            onClick={() => setActiveTab('attendance')}
            className={cn(
              "px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
              activeTab === 'attendance' ? "bg-brand-primary text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            {isAdmin ? 'Lịch sử chấm công' : 'Chấm công của tôi'}
          </button>
        </div>
      </div>

      {activeTab === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Check In/Out Card */}
          {!isAdmin && (
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center space-y-6">
                <div className={cn(
                  "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg transition-all duration-500",
                  currentAttendance ? "bg-amber-100 text-amber-600 animate-pulse" : "bg-emerald-100 text-emerald-600"
                )}>
                  <Clock size={40} />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {currentAttendance ? 'Đang trong ca làm' : 'Sẵn sàng vào ca'}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {currentAttendance 
                      ? `Bắt đầu lúc: ${new Date(currentAttendance.checkIn).toLocaleTimeString('vi-VN')}`
                      : 'Nhấn nút bên dưới để bắt đầu chấm công'}
                  </p>
                </div>

                <button
                  onClick={currentAttendance ? handleCheckOut : handleCheckIn}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all flex items-center justify-center gap-3",
                    currentAttendance 
                      ? "bg-amber-500 text-white shadow-amber-100 hover:bg-amber-600" 
                      : "bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700"
                  )}
                >
                  {currentAttendance ? (
                    <><Square size={24} fill="currentColor" /> Kết thúc ca</>
                  ) : (
                    <><Play size={24} fill="currentColor" /> Bắt đầu ca</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Attendance History */}
          <div className={cn("bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden", !isAdmin ? "lg:col-span-2" : "lg:col-span-3")}>
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Lịch sử chấm công</h3>
              <Calendar size={20} className="text-gray-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <tr>
                    {isAdmin && <th className="px-6 py-4">Nhân viên</th>}
                    <th className="px-6 py-4">Ngày</th>
                    <th className="px-6 py-4">Giờ vào</th>
                    <th className="px-6 py-4">Giờ ra</th>
                    <th className="px-6 py-4 text-right">Tổng giờ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {attendances
                    .filter(a => isAdmin || a.userId === user.id)
                    .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime())
                    .map(a => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      {isAdmin && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold">
                              {users.find(u => u.id === a.userId)?.name.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900">{users.find(u => u.id === a.userId)?.name}</span>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(a.checkIn).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-emerald-600">
                        {new Date(a.checkIn).toLocaleTimeString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-amber-600">
                        {a.checkOut ? new Date(a.checkOut).toLocaleTimeString('vi-VN') : '---'}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-gray-900">
                        {a.totalHours ? `${a.totalHours}h` : '---'}
                      </td>
                    </tr>
                  ))}
                  {attendances.length === 0 && (
                    <tr>
                      <td colSpan={isAdmin ? 5 : 4} className="px-6 py-12 text-center text-gray-400 italic">
                        Chưa có dữ liệu chấm công
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payroll' && isAdmin && (
        <div className="space-y-8">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-brand-bg text-brand-primary rounded-2xl">
                  <DollarSign size={24} />
                </div>
                <h4 className="font-bold text-gray-500">Tổng quỹ lương</h4>
              </div>
              <p className="text-3xl font-black text-gray-900">
                {new Intl.NumberFormat('vi-VN').format(payrolls.reduce((sum, p) => sum + p.amount, 0))}đ
              </p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <CheckCircle size={24} />
                </div>
                <h4 className="font-bold text-gray-500">Đã thanh toán</h4>
              </div>
              <p className="text-3xl font-black text-gray-900">{payrolls.length} lượt</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                  <AlertCircle size={24} />
                </div>
                <h4 className="font-bold text-gray-500">Chờ phát lương</h4>
              </div>
              <p className="text-3xl font-black text-gray-900">
                {users.filter(u => calculateUnpaidSalary(u.id) > 0).length} nhân viên
              </p>
            </div>
          </div>

          {/* Payroll Management Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h3 className="font-bold text-gray-900">Danh sách phát lương</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Nhân viên</th>
                    <th className="px-6 py-4">Mức lương/giờ</th>
                    <th className="px-6 py-4">Tổng giờ chờ</th>
                    <th className="px-6 py-4">Lương tạm tính</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(u => {
                    const unpaidSalary = calculateUnpaidSalary(u.id);
                    const totalHours = attendances
                      .filter(a => a.userId === u.id && a.checkOut)
                      .reduce((sum, a) => sum + (a.totalHours || 0), 0);
                    
                    return (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{u.name}</p>
                              <p className="text-xs text-gray-400">{u.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-600">
                          {u.hourlyRate ? `${new Intl.NumberFormat('vi-VN').format(u.hourlyRate)}đ/h` : 'Chưa thiết lập'}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {totalHours.toFixed(1)}h
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-black text-brand-primary">
                            {new Intl.NumberFormat('vi-VN').format(unpaidSalary)}đ
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            disabled={unpaidSalary <= 0}
                            onClick={() => handlePaySalary(u.id)}
                            className="bg-brand-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all disabled:opacity-30 disabled:shadow-none"
                          >
                            Phát lương
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h3 className="font-bold text-gray-900">Lịch sử giao dịch</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Nhân viên</th>
                    <th className="px-6 py-4">Kỳ lương</th>
                    <th className="px-6 py-4">Ngày trả</th>
                    <th className="px-6 py-4">Số tiền</th>
                    <th className="px-6 py-4 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {payrolls.sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()).map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {users.find(u => u.id === p.userId)?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{p.period}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(p.paidAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 font-black text-gray-900">
                        {new Intl.NumberFormat('vi-VN').format(p.amount)}đ
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                          Đã chuyển
                        </span>
                      </td>
                    </tr>
                  ))}
                  {payrolls.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                        Chưa có lịch sử phát lương
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePayrollView;
