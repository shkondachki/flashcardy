import { useState, useEffect } from 'react';
import { Tech, FlashcardFilters } from '../types';
import { TECH_OPTIONS } from '../constants';
import styles from './SearchAndFilters.module.scss';
import { Search } from 'lucide-react';

interface SearchAndFiltersProps {
  filters: FlashcardFilters;
  onFiltersChange: (filters: FlashcardFilters) => void;
  availableCategories: string[];
}

export function SearchAndFilters({
   filters,
   onFiltersChange,
   availableCategories,
}: SearchAndFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounce search with minimum 2 characters
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = filters.search || '';

      // Only update if search value actually changed
      if (searchInput !== currentSearch) {
        if (searchInput.length >= 2 || searchInput.length === 0) {
          onFiltersChange({
            tech: filters.tech,
            category: filters.category,
            search: searchInput || undefined
          });
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, onFiltersChange]); // Don't include filters

  const handleTechChange = (tech: Tech | '') => {
    onFiltersChange({
      tech: tech || undefined,
      category: filters.category,
      search: filters.search
    });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      tech: filters.tech,
      category: category || undefined,
      search: filters.search
    });
  };

  const clearFilters = () => {
    setSearchInput('');
    onFiltersChange({});
  };

  const hasActiveFilters = filters.tech || filters.category || filters.search;

  return (
      <div className={styles.container}>
        <div className={styles.searchBox}>
          <Search size={20}/>

          <input
              type="text"
              placeholder="Search questions and answers..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <div className="filterGroup">
            <label htmlFor="tech-filter">Technology:</label>
            <select
                id="tech-filter"
                value={filters.tech || ''}
                onChange={(e) => handleTechChange(e.target.value as Tech | '')}
                className={styles.filterSelect}
            >
              <option value="">All Technologies</option>
              {TECH_OPTIONS.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
              ))}
            </select>
          </div>

          <div className="filterGroup">
            <label htmlFor="category-filter">Tag:</label>
            <select
                id="category-filter"
                value={filters.category || ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={styles.filterSelect}
            >
              <option value="">All Tags</option>
              {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-outline-secondary">
                Clear Filters
              </button>
          )}
        </div>
      </div>
  );
}