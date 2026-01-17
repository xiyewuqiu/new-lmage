import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error('请填上你的秘密代号！');
      return;
    }

    setLoading(true);
    try {
      const result = await login(formData);
      if (result.success) {
        toast.success('欢迎回来！');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('登录失败...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-xl font-hand font-bold text-pencil ml-1 rotate-slight-n1">
            你是谁？
          </label>
          <input
            type="text"
            name="username"
            placeholder="名字或邮箱"
            className="input-hand"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xl font-hand font-bold text-pencil ml-1 rotate-slight-1">
            秘密口令
          </label>
          <input
            type="password"
            name="password"
            placeholder="嘘..."
            className="input-hand"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary w-full mt-8 text-2xl font-bold py-3 rotate-slight-n1 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? '正在翻开...' : '打开日记'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="font-hand text-lg text-gray-500">
          第一次来？ <Link to="/register" className="text-marker-blue underline decoration-wavy font-bold hover:text-blue-500">领一本手账</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
