import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import {
  User,
  Envelope,
  Article,
  PencilSimple,
  Check,
  X,
  IdentificationCard,
  CalendarCheck,
  Fingerprint
} from '@phosphor-icons/react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username) return toast.error('名字不能为空！');

    setIsSubmitting(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success('证件已更新！');
        setIsEditing(false);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('更新失败...');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      
      <div className="mb-8">
        <h1 className="text-4xl font-hand font-bold text-pencil rotate-slight-1">
          <IdentificationCard className="inline mr-2" weight="duotone" /> 
          身份证明
        </h1>
        <p className="text-gray-400 font-hand mt-1 rotate-slight-n1">
          兹证明...
        </p>
      </div>

      <div className="bg-white p-8 shadow-sketch border border-gray-200 relative rotate-slight-1 rounded-sm">
         {/* Tape */}
         <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 backdrop-blur-sm rotate-2 shadow-tape"></div>

         <div className="flex flex-col md:flex-row gap-8">
            {/* Photo Area */}
            <div className="flex-shrink-0 text-center">
              <div className="w-32 h-40 bg-gray-100 border-2 border-dashed border-gray-300 mx-auto flex items-center justify-center overflow-hidden relative">
                 {formData.avatar ? (
                   <img src={formData.avatar} alt="Me" className="w-full h-full object-cover" />
                 ) : (
                   <User size={64} className="text-gray-300" weight="thin" />
                 )}
              </div>
              <p className="font-hand text-sm text-gray-400 mt-2">照片</p>
            </div>

            {/* Form Area */}
            <div className="flex-1">
               <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                   <label className="flex items-center gap-2 font-hand text-lg text-pencil mb-1">
                     <User /> 姓名 / 代号
                   </label>
                   {isEditing ? (
                     <input
                       type="text"
                       name="username"
                       value={formData.username}
                       onChange={handleChange}
                       className="input-hand w-full text-xl font-bold"
                     />
                   ) : (
                     <div className="text-2xl font-hand font-bold border-b-2 border-transparent px-2 py-1">
                       {formData.username}
                     </div>
                   )}
                 </div>

                 <div>
                   <label className="flex items-center gap-2 font-hand text-lg text-pencil mb-1">
                     <Envelope /> 联系方式
                   </label>
                   {isEditing ? (
                     <input
                       type="email"
                       name="email"
                       value={formData.email}
                       onChange={handleChange}
                       className="input-hand w-full text-xl"
                     />
                   ) : (
                     <div className="text-xl font-hand border-b-2 border-transparent px-2 py-1">
                       {formData.email}
                     </div>
                   )}
                 </div>

                 <div>
                   <label className="flex items-center gap-2 font-hand text-lg text-pencil mb-1">
                     <Article /> 个人简介
                   </label>
                   {isEditing ? (
                     <textarea
                       name="bio"
                       value={formData.bio}
                       onChange={handleChange}
                       className="w-full bg-transparent border-2 border-dashed border-gray-300 rounded p-2 font-hand text-lg focus:border-pencil outline-none"
                       rows="3"
                     />
                   ) : (
                     <div className="text-lg font-hand border-b-2 border-transparent px-2 py-1 italic text-gray-600">
                       {formData.bio || "这家伙很懒，什么都没写。"}
                     </div>
                   )}
                 </div>

                 <div className="pt-4 border-t-2 border-dashed border-gray-200 flex justify-end gap-3">
                   {isEditing ? (
                     <>
                       <button type="button" onClick={handleCancel} className="btn-doodle text-sm px-4 py-1">
                         <X className="inline mr-1" /> 取消
                       </button>
                       <button type="submit" disabled={isSubmitting} className="btn-primary text-sm px-4 py-1">
                         <Check className="inline mr-1" /> 保存
                       </button>
                     </>
                   ) : (
                     <button type="button" onClick={() => setIsEditing(true)} className="btn-doodle text-sm px-4 py-1">
                       <PencilSimple className="inline mr-1" /> 修改证件
                     </button>
                   )}
                 </div>
               </form>
            </div>
         </div>
      </div>

      <div className="mt-8 flex justify-between text-gray-400 font-hand text-sm px-4">
        <div className="flex items-center gap-1">
           <CalendarCheck /> 加入时间: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '未知'}
        </div>
        <div className="flex items-center gap-1">
           <Fingerprint /> 编号: {user?.id?.substring(0, 8)}...
        </div>
      </div>

    </div>
  );
};

export default ProfilePage;
