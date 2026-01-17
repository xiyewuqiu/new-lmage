import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { isValidEmail, validatePassword, validateUsername } from '@/utils/validation';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username) return toast.error('你是谁？');
    if (!formData.email) return toast.error('得留个邮箱！');
    if (formData.password.length < 6) return toast.error('暗号太短了！');
    if (formData.password !== formData.confirmPassword) return toast.error('两次暗号对不上！');

    setLoading(true);

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        toast.success('手账本已备好！欢迎！');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('没法创建账号...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-xl font-hand font-bold text-pencil ml-1 rotate-slight-n1">
            起个名字
          </label>
          <input
            type="text"
            name="username"
            placeholder="艺术家大名"
            className="input-hand"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xl font-hand font-bold text-pencil ml-1 rotate-slight-1">
            邮箱
          </label>
          <input
            type="email"
            name="email"
            placeholder="contact@doodle.com"
            className="input-hand"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xl font-hand font-bold text-pencil ml-1 rotate-slight-n1">
            秘密暗号
          </label>
          <input
            type="password"
            name="password"
            placeholder="至少6个字"
            className="input-hand"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xl font-hand font-bold text-pencil ml-1 rotate-slight-1">
            重复暗号
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="确认一下"
            className="input-hand"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary w-full mt-8 text-2xl font-bold py-3 rotate-slight-n1 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? '正在装订...' : '创建手账本'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="font-hand text-lg text-gray-500">
          已经有手账了？ <Link to="/login" className="text-marker-blue underline decoration-wavy font-bold hover:text-blue-500">打开它</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
