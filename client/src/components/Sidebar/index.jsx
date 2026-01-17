import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useImageStore } from '@/store/imageStore';
import { useFavoriteStore } from '@/store/favoriteStore';
import { 
  House, 
  Image as ImageIcon, 
  Star, 
  Gear, 
  Question 
} from '@phosphor-icons/react';

const Sidebar = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { images } = useImageStore();
  const { favorites } = useFavoriteStore();

  const menuItems = [
    { path: '/', icon: House, label: '首页', public: true },
    { path: '/dashboard', icon: ImageIcon, label: '图库', badge: images.length, requireAuth: true },
    { path: '/favorites', icon: Star, label: '收藏', badge: favorites.size, requireAuth: true },
    { path: '/settings', icon: Gear, label: '设置', requireAuth: true },
    { path: '/help', icon: Question, label: '帮助', public: true },
  ];

  const filterMenuItems = (items) => {
    return items.filter((item) => item.public || (item.requireAuth && isAuthenticated));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar (The Spine) */}
      <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-2rem)] sticky top-4 bg-white shadow-sketch rounded-lg rotate-slight-n1 border border-gray-200 z-40">
        <div className="p-6 border-b-2 border-dashed border-gray-200">
          <h1 className="text-3xl font-bold -rotate-2 text-pencil">
            <span className="bg-marker-yellow px-2 transform inline-block">涂鸦</span>
            <br />
            手账
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          {filterMenuItems(menuItems).map((item) => {
             const Icon = item.icon;
             const active = isActive(item.path);
             
             return (
               <Link
                 key={item.path}
                 to={item.path}
                 className={`flex items-center gap-3 px-4 py-3 text-xl transition-all duration-300 group ${
                   active 
                     ? 'text-pencil font-bold translate-x-2' 
                     : 'text-gray-500 hover:text-pencil hover:rotate-slight-1'
                 }`}
               >
                 <Icon size={28} weight={active ? "duotone" : "regular"} className={active ? "text-indigo-500" : ""} />
                 <span className={`relative ${active ? "after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-2 after:bg-marker-pink/50 after:-z-10 after:-rotate-1" : ""}`}>
                   {item.label}
                 </span>
                 {item.badge > 0 && (
                   <span className="ml-auto text-sm font-sans bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full rotate-2">
                     {item.badge}
                   </span>
                 )}
               </Link>
             );
          })}
        </nav>
        
        <div className="p-4 text-center text-gray-400 text-sm border-t-2 border-dashed border-gray-200">
           ~ 始于 2026 ~
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-dashed border-gray-300 z-50 px-4 py-2 flex justify-around shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        {filterMenuItems(menuItems).map((item) => {
           const Icon = item.icon;
           const active = isActive(item.path);
           return (
             <Link
               key={item.path}
               to={item.path}
               className={`flex flex-col items-center p-2 transition-transform ${active ? '-translate-y-2' : ''}`}
             >
               <div className={`p-2 rounded-full ${active ? 'bg-marker-yellow shadow-sketch border-2 border-pencil' : ''}`}>
                 <Icon size={24} weight={active ? "fill" : "regular"} className="text-pencil" />
               </div>
               <span className="text-xs mt-1">{item.label}</span>
             </Link>
           );
        })}
      </nav>
    </>
  );
};

export default Sidebar;
