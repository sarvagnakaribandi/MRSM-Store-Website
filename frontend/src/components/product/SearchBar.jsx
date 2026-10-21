import React, { useState, useEffect } from 'react';
import { SearchIcon, CloseIcon } from '../common/Icons';

export const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Search shirts, trousers, jeans, kurtas...',
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(value);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onChange) onChange(val);
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onChange) onChange('');
  };

  return (
    <div
      className={`search-bar-wrap ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: '14px',
          color: 'var(--color-mocha)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <SearchIcon size={18} />
      </span>

      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="form-input"
        style={{
          paddingLeft: '42px',
          paddingRight: searchTerm ? '40px' : '14px',
          height: '46px',
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.925rem'
        }}
      />

      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          style={{
            position: 'absolute',
            right: '12px',
            color: 'var(--text-muted)',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <CloseIcon size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
