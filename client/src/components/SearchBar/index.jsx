import { useState } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import {
  HiOutlineSearch,
  HiX,
  HiOutlineArrowRight,
  HiOutlineCalendar,
  HiOutlineDocument,
  HiOutlinePhotograph,
} from 'react-icons/hi';
import './SearchBar.css';

/**
 * 搜索栏组件
 */
const SearchBar = ({ 
  placeholder = '搜索图片...', 
  onSearch, 
  defaultValue = '',
  showFilters = false,
  onFilterChange,
}) => {
  const [query, setQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <motion.div
      className="search-bar-container"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className={`search-bar ${isFocused ? 'focused' : ''}`}>
        <HiOutlineSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {query && (
          <button
            type="button"
            className="search-clear"
            onClick={handleClear}
            aria-label="清除"
          >
            <HiX />
          </button>
        )}
        <button type="submit" className="search-submit" aria-label="搜索">
          <HiOutlineArrowRight />
        </button>
      </form>

      {showFilters && (
        <div className="search-filters">
          <button
            className="filter-btn"
            onClick={() => onFilterChange?.('date')}
          >
            <HiOutlineCalendar />
            日期
          </button>
          <button
            className="filter-btn"
            onClick={() => onFilterChange?.('size')}
          >
            <HiOutlineDocument />
            大小
          </button>
          <button
            className="filter-btn"
            onClick={() => onFilterChange?.('type')}
          >
            <HiOutlinePhotograph />
            类型
          </button>
        </div>
      )}
    </motion.div>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  showFilters: PropTypes.bool,
  onFilterChange: PropTypes.func,
};

export default SearchBar;
