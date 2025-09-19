import React, {
  ChangeEvent,
  FormEvent,
  useState,
  useEffect,
  useRef,
} from 'react';

type FilterFormProps = {
  search: string;
  category: string;
  source: string;
  date: string;
  saved: boolean;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onSourceChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onSave: () => void;
  onClear: () => void;
};

const FilterForm: React.FC<FilterFormProps> = ({
  search,
  category,
  source,
  date,
  saved,
  categories,
  onSearchChange,
  onCategoryChange,
  onSourceChange,
  onDateChange,
  onSubmit,
  onSave,
  onClear,
}) => {
  const [searchValue, setSearchValue] = useState(search);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      onSearchChange(value);
    }, 1500);
  };

  return (
    <form onSubmit={onSubmit} className='filter-form'>
      <input
        type='text'
        placeholder='Search articles...'
        value={searchValue}
        onChange={handleSearchChange}
      />
      <select value={category} onChange={onCategoryChange}>
        <option value=''>All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select value={source} onChange={onSourceChange}>
        <option value='newsapi'>NewsAPI</option>
        <option value='guardian'>The Guardian</option>
        <option value='nyt'>NYT</option>
      </select>
      <input type='date' value={date} onChange={onDateChange} />
      <button type='submit'>Search</button>
      <div>
        <button type='button' onClick={onClear}>
          Clear Preference
        </button>
        <button type='button' onClick={onSave}>
          Save Preference
        </button>
        {saved && (
          <span
            style={{ color: 'green', fontSize: '1.2em', marginLeft: '4px' }}
          >
            &#10003;
          </span>
        )}
      </div>
    </form>
  );
};

export default FilterForm;
