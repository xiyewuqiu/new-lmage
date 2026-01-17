import PropTypes from 'prop-types';
import { formatFileSize, formatDate } from '@/utils/format';
import {
  Heart,
  Copy,
  Trash,
  CheckCircle,
  Circle
} from '@phosphor-icons/react';

const ImageCard = ({
  image,
  isSelected = false,
  isFavorite = false,
  showSelection = false,
  onSelect,
  onFavorite,
  onCopy,
  onDelete,
  onClick,
}) => {
  return (
    <div
      className={`
        bg-white p-3 pb-8 shadow-sketch border border-gray-200 relative transition-transform duration-300 hover:z-20 hover:scale-105 hover:rotate-0 cursor-pointer
        ${isSelected ? 'ring-2 ring-marker-blue rotate-0' : 'rotate-slight-1 even:rotate-slight-n1'}
      `}
      onClick={(e) => {
        if (!e.target.closest('button')) onClick?.(image);
      }}
    >
      {/* Tape */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 backdrop-blur-sm -rotate-2 shadow-tape z-10"></div>

      {/* Selection Checkbox (Sticker Style) */}
      {showSelection && (
        <button
          className="absolute top-2 left-2 z-30 text-pencil hover:text-marker-blue bg-white rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(image.id);
          }}
        >
          {isSelected ? <CheckCircle size={32} weight="fill" className="text-marker-blue" /> : <Circle size={32} />}
        </button>
      )}

      {/* Image Area */}
      <div className="aspect-square bg-gray-50 overflow-hidden border border-gray-100 relative group">
        <img 
          src={image.src} 
          alt={image.fileName} 
          loading="lazy" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {/* Hover Actions (Stickers) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
           {onCopy && (
             <button
               className="bg-white p-2 rounded-full shadow-lg hover:bg-marker-yellow transition-transform hover:rotate-12 hover:scale-110"
               onClick={(e) => { e.stopPropagation(); onCopy(image); }}
               title="复制链接"
             >
               <Copy size={20} className="text-pencil" />
             </button>
           )}
           {onFavorite && (
             <button
               className="bg-white p-2 rounded-full shadow-lg hover:bg-marker-pink transition-transform hover:-rotate-12 hover:scale-110"
               onClick={(e) => { e.stopPropagation(); onFavorite(image.id); }}
               title="喜欢"
             >
               <Heart size={20} weight={isFavorite ? "fill" : "regular"} className={isFavorite ? "text-red-500" : "text-pencil"} />
             </button>
           )}
           {onDelete && (
             <button
               className="bg-white p-2 rounded-full shadow-lg hover:bg-red-100 transition-transform hover:rotate-6 hover:scale-110"
               onClick={(e) => { e.stopPropagation(); onDelete(image); }}
               title="丢弃"
             >
               <Trash size={20} className="text-red-500" />
             </button>
           )}
        </div>
      </div>

      {/* Caption */}
      <div className="mt-3 px-1">
        <p className="font-hand text-xl text-pencil truncate leading-tight" title={image.fileName}>
          {image.fileName}
        </p>
        <div className="flex justify-between items-center mt-1 text-gray-400 text-xs font-hand">
           <span>{formatFileSize(image.fileSize)}</span>
           <span>{formatDate(image.uploadTime)}</span>
        </div>
      </div>
    </div>
  );
};

ImageCard.propTypes = {
  image: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  isFavorite: PropTypes.bool,
  showSelection: PropTypes.bool,
  onSelect: PropTypes.func,
  onFavorite: PropTypes.func,
  onCopy: PropTypes.func,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
};

export default ImageCard;
