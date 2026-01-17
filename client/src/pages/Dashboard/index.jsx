import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '@/store/imageStore';
import { useFavoriteStore } from '@/store/favoriteStore';
import toast from 'react-hot-toast';
import {
  Image as ImageIcon,
  CloudArrowUp,
  SquaresFour,
  List,
  CheckCircle,
  Trash,
  XCircle,
  Funnel,
  SortAscending,
  SortDescending,
  File
} from '@phosphor-icons/react';
import ImageCard from '@/components/ImageCard';

const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    images,
    isLoading,
    filters,
    selectedImages,
    isSelectionMode,
    fetchImages,
    deleteImage,
    deleteImages,
    setViewMode,
    setSortBy,
    toggleSelectionMode,
    toggleImageSelection,
    toggleSelectAll,
    clearSelection,
  } = useImageStore();

  const { favorites, toggleFavorite } = useFavoriteStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleDeleteClick = (image) => {
    setImageToDelete(image);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;
    const result = await deleteImage(imageToDelete.id);
    if (result.success) {
      toast.success('涂鸦已擦除！');
      setShowDeleteModal(false);
      setImageToDelete(null);
    } else {
      toast.error(result.error);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedImages.size === 0) return;
    if (window.confirm(`确定要擦除这 ${selectedImages.size} 张涂鸦吗？`)) {
      const result = await deleteImages(Array.from(selectedImages));
      if (result.success) {
        toast.success(`已擦除 ${selectedImages.size} 张涂鸦。`);
      } else {
        toast.error(result.error);
      }
    }
  };

  const copyImageUrl = (image) => {
    navigator.clipboard.writeText(window.location.origin + image.src);
    toast.success('链接已复制！');
  };

  const isFavorite = (imageId) => favorites.has(imageId);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-2 border-dashed border-gray-200 pb-4">
        <div>
          <h1 className="text-4xl font-hand font-bold text-pencil rotate-slight-n1">
            我的涂鸦
          </h1>
          <p className="text-gray-400 font-hand mt-1">
            收集了 {images.length} 个美好瞬间
          </p>
        </div>

        <div className="flex gap-2 mt-4 md:mt-0">
          {isSelectionMode ? (
             <div className="flex gap-2 bg-yellow-50 p-2 rounded-lg border border-marker-yellow rotate-1">
                <button onClick={toggleSelectAll} className="btn-doodle text-sm py-1 px-2">
                   全选
                </button>
                <button onClick={handleBatchDelete} className="btn-doodle text-sm py-1 px-2 text-red-500 hover:bg-red-50">
                   <Trash size={18} />
                </button>
                <button onClick={() => { toggleSelectionMode(); clearSelection(); }} className="btn-doodle text-sm py-1 px-2">
                   <XCircle size={18} />
                </button>
             </div>
          ) : (
             <>
               <button 
                 onClick={toggleSelectionMode} 
                 className="btn-doodle flex items-center gap-1 text-sm py-1 px-3"
                 title="批量选择"
               >
                 <CheckCircle size={20} /> 选择
               </button>
               <button 
                 onClick={() => setSortBy(filters.sortBy === 'newest' ? 'oldest' : 'newest')} 
                 className="btn-doodle flex items-center gap-1 text-sm py-1 px-3"
                 title="排序"
               >
                 {filters.sortBy === 'newest' ? <SortDescending size={20} /> : <SortAscending size={20} />}
               </button>
               <div className="flex bg-gray-100 p-1 rounded-md rotate-slight-1">
                 <button 
                   onClick={() => setViewMode('grid')} 
                   className={`p-1 rounded ${filters.viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-400'}`}
                 >
                   <SquaresFour size={20} />
                 </button>
                 <button 
                   onClick={() => setViewMode('list')} 
                   className={`p-1 rounded ${filters.viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-400'}`}
                 >
                   <List size={20} />
                 </button>
               </div>
             </>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-bounce text-2xl font-hand text-pencil">正在翻阅手账...</div>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
          <ImageIcon size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-2xl font-hand text-gray-500">这里空空如也！</h3>
          <button onClick={() => navigate('/')} className="btn-primary mt-6 rotate-slight-n1">
            <CloudArrowUp className="inline mr-2" />
            开始记录
          </button>
        </div>
      ) : (
        <div className={`
          ${filters.viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
            : 'space-y-4'
          }
        `}>
          {images.map((image) => (
            filters.viewMode === 'grid' ? (
              <ImageCard
                key={image.id}
                image={image}
                isSelected={selectedImages.has(image.id)}
                isFavorite={isFavorite(image.id)}
                showSelection={isSelectionMode}
                onSelect={toggleImageSelection}
                onFavorite={toggleFavorite}
                onCopy={copyImageUrl}
                onDelete={handleDeleteClick}
                onClick={(img) => console.log('View', img)}
              />
            ) : (
              <div key={image.id} className="flex items-center gap-4 bg-white p-4 border-b border-dashed border-gray-200">
                 <img src={image.src} className="w-16 h-16 object-cover border border-gray-200" />
                 <div className="flex-1">
                    <div className="font-hand font-bold text-lg">{image.fileName}</div>
                 </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white p-8 max-w-sm w-full shadow-sketch rotate-slight-1 relative" onClick={e => e.stopPropagation()}>
             <div className="tape-top"></div>
             <h3 className="text-2xl font-hand font-bold text-red-500 mb-4 text-center">撕掉这一页？</h3>
             <p className="text-center font-hand text-gray-500 mb-6">撕了可就粘不回去了。</p>
             <div className="flex gap-4 justify-center">
                <button onClick={() => setShowDeleteModal(false)} className="btn-doodle">留着吧</button>
                <button onClick={confirmDelete} className="btn-doodle bg-red-100 hover:bg-red-200 text-red-600 border-red-200">是的，擦掉它</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
