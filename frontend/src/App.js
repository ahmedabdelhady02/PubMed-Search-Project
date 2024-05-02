import React, { useState } from 'react';
import axios from 'axios';
import SearchForm from './SearchForm';
import ResultsList from './ResultsList';

function App() {
  const [results, setResults] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const fetchResults = async (query, page) => {
    const response = await axios.post('/search', { query, retstart: page * 20, retmax: 20 });
    const results = await axios.get(`/details?ids=${response.data.ids}`);
    setResults(results.data.details);
  };

  const handleSearch = (query) => {
    setQuery(query);
    setCurrentPage(0);
    fetchResults(query, currentPage);
  };

  const handlePageChange = (direction) => {
    const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    setCurrentPage(newPage);
    fetchResults(query, newPage);
  };

  return (
    <div>
      <SearchForm onSearch={handleSearch} />
      {results && <ResultsList results={results} onPageChange={handlePageChange} currentPage={currentPage} />}
    </div>
  );
}

export default App;
