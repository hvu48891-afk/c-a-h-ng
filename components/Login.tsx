import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Lock, User as UserIcon, ChefHat } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
  onRegister: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, users, onRegister }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('STAFF');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const foundUser = users.find(u => u.username === username);
    // In a real app, we'd check password too, but for mock we just check existence
    // To make it slightly more "real", let's assume password is same as username for mock users
    // or just allow any password for now since we don't store passwords in the User type
    
    if (foundUser) {
      onLogin(foundUser);
    } else {
      setError('Tên đăng nhập không tồn tại');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (users.some(u => u.username === username)) {
      setError('Tên đăng nhập đã tồn tại');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      name: name || username,
      role,
      hourlyRate: role === 'ADMIN' ? 50000 : 25000
    };

    onRegister(newUser);
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-rose-600 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
            <ChefHat size={40} className="text-rose-600" />
          </div>
          <h1 className="text-2xl font-black text-white">RestoMaster</h1>
          <p className="text-rose-100">{isRegister ? 'Đăng ký tài khoản mới' : 'Hệ thống Quản lý Nhà hàng'}</p>
        </div>
        
        <form onSubmit={isRegister ? handleRegister : handleLogin} className="p-8 space-y-4">
          {error && (
            <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-medium border border-rose-100">
              {error}
            </div>
          )}
          
          {isRegister && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Họ và tên</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-rose-500 transition-all font-medium"
                  placeholder="Nhập họ tên..."
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Tên đăng nhập</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-rose-500 transition-all font-medium"
                placeholder="Nhập tên đăng nhập..."
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-rose-500 transition-all font-medium"
                placeholder="Nhập mật khẩu..."
                required
              />
            </div>
          </div>

          {isRegister && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Vai trò</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRole('STAFF')}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-bold transition-all",
                    role === 'STAFF' ? "bg-rose-600 text-white shadow-md" : "bg-gray-100 text-gray-500"
                  )}
                >
                  Nhân viên
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-bold transition-all",
                    role === 'ADMIN' ? "bg-rose-600 text-white shadow-md" : "bg-gray-100 text-gray-500"
                  )}
                >
                  Quản trị viên
                </button>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all hover:-translate-y-1 active:translate-y-0 mt-4"
          >
            {isRegister ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-rose-600 font-bold hover:underline"
            >
              {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
