import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchFilterProps<T> {
  data: T[];
  onFilter: (filteredData: T[]) => void;
  placeholder?: string;
  additionalFilters?: (item: T) => boolean;
}

const SearchFilter = <T extends { businessName: string; email: string; firstName: string; lastName: string }>({
  data,
  onFilter,
  placeholder = 'Search...',
  additionalFilters,
}: SearchFilterProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const lowerCaseQuery = searchTerm.toLowerCase();
    const filteredData = data.filter((item) => {
      const matchesSearch =
        item.businessName.toLowerCase().includes(lowerCaseQuery) ||
        item.email.toLowerCase().includes(lowerCaseQuery) ||
        `${item.firstName} ${item.lastName}`
          .toLowerCase()
          .includes(lowerCaseQuery);

      return matchesSearch && (additionalFilters ? additionalFilters(item) : true);
    });

    onFilter(filteredData);
  }, [searchTerm, data, additionalFilters, onFilter]);

  return (
    <div className="relative w-full sm:w-[280px]">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="w-full pl-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchFilter;